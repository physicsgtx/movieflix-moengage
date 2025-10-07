package com.moengage.movieflix.service;

import com.moengage.movieflix.dto.*;
import com.moengage.movieflix.dto.omdb.OmdbMovieDetail;
import com.moengage.movieflix.dto.omdb.OmdbSearchResponse;
import com.moengage.movieflix.dto.omdb.OmdbSearchResult;
import com.moengage.movieflix.entity.Movie;
import com.moengage.movieflix.entity.BlacklistedMovie;
import com.moengage.movieflix.exception.BadRequestException;
import com.moengage.movieflix.exception.ResourceNotFoundException;
import com.moengage.movieflix.repository.MovieRepository;
import com.moengage.movieflix.repository.BlacklistedMovieRepository;
import com.moengage.movieflix.specification.MovieSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieService {

    private final MovieRepository movieRepository;
    private final BlacklistedMovieRepository blacklistedMovieRepository;
    private final OmdbApiService omdbApiService;

    @Cacheable(value = "movies", key = "#request.hashCode()")
    @Transactional(readOnly = true)
    public MovieListResponse searchMovies(MovieSearchRequest request) {
        // If search query provided, fetch from external API first
        if (request.getSearch() != null && !request.getSearch().isBlank()) {
            fetchAndCacheMoviesFromApi(request.getSearch());
        }

        // Build specification for filtering
        Specification<Movie> spec = Specification.where(null);

        if (request.getSearch() != null && !request.getSearch().isBlank()) {
            spec = spec.and(MovieSpecification.titleContains(request.getSearch()));
        }

        if (request.getGenres() != null && !request.getGenres().isEmpty()) {
            spec = spec.and(MovieSpecification.hasGenres(request.getGenres()));
        }

        if (request.getMinYear() != null) {
            spec = spec.and(MovieSpecification.yearGreaterThanOrEqual(request.getMinYear()));
        }

        if (request.getMaxYear() != null) {
            spec = spec.and(MovieSpecification.yearLessThanOrEqual(request.getMaxYear()));
        }

        if (request.getMinRating() != null) {
            spec = spec.and(MovieSpecification.ratingGreaterThanOrEqual(request.getMinRating()));
        }

        // Build sort
        Sort sort = buildSort(request.getSort(), request.getOrder());

        // Build pageable
        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, sort);

        // Query database
        Page<Movie> moviePage = movieRepository.findAll(spec, pageable);

        List<MovieResponse> movieResponses = moviePage.getContent().stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());

        return MovieListResponse.builder()
                .movies(movieResponses)
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .currentPage(moviePage.getNumber())
                .pageSize(moviePage.getSize())
                .build();
    }

    @Cacheable(value = "movies", key = "#imdbId")
    @Transactional
    public MovieResponse getMovieById(String imdbId) {
        // Check if movie is blacklisted
        if (blacklistedMovieRepository.existsByImdbId(imdbId)) {
            log.info("Movie {} is blacklisted, not returning", imdbId);
            throw new ResourceNotFoundException("Movie not found with ID: " + imdbId);
        }

        // Check cache first
        Optional<Movie> cachedMovie = movieRepository.findByImdbId(imdbId);
        
        if (cachedMovie.isPresent()) {
            log.info("Movie found in cache: {}", imdbId);
            return MovieResponse.fromEntity(cachedMovie.get());
        }

        // Fetch from external API
        log.info("Movie not in cache, fetching from OMDb API: {}", imdbId);
        OmdbMovieDetail omdbMovie = omdbApiService.getMovieDetails(imdbId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + imdbId));

        // Save to cache
        Movie movie = convertOmdbDetailToMovie(omdbMovie);
        movie = movieRepository.save(movie);

        return MovieResponse.fromEntity(movie);
    }

    @Cacheable(value = "movieStats")
    @Transactional(readOnly = true)
    public MovieStatsResponse getMovieStats() {
        List<Movie> allMovies = movieRepository.findAll();

        if (allMovies.isEmpty()) {
            return MovieStatsResponse.builder()
                    .genreDistribution(new HashMap<>())
                    .averageRatingByGenre(new HashMap<>())
                    .averageRuntimeByYear(new HashMap<>())
                    .overallAverageRating(0.0)
                    .totalMovies(0L)
                    .build();
        }

        // Genre distribution
        Map<String, Long> genreDistribution = allMovies.stream()
                .filter(m -> m.getGenre() != null)
                .flatMap(m -> m.getGenre().stream())
                .collect(Collectors.groupingBy(g -> g, Collectors.counting()));

        // Average rating by genre
        Map<String, Double> averageRatingByGenre = new HashMap<>();
        for (String genre : genreDistribution.keySet()) {
            double avgRating = allMovies.stream()
                    .filter(m -> m.getGenre() != null && m.getGenre().contains(genre))
                    .filter(m -> m.getImdbRating() != null)
                    .mapToDouble(Movie::getImdbRating)
                    .average()
                    .orElse(0.0);
            averageRatingByGenre.put(genre, Math.round(avgRating * 100.0) / 100.0);
        }

        // Average runtime by year
        Map<Integer, Double> averageRuntimeByYear = allMovies.stream()
                .filter(m -> m.getRuntime() != null)
                .collect(Collectors.groupingBy(
                        Movie::getYear,
                        Collectors.averagingInt(Movie::getRuntime)
                ))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> Math.round(e.getValue() * 100.0) / 100.0
                ));

        // Overall average rating
        Double overallAverageRating = allMovies.stream()
                .filter(m -> m.getImdbRating() != null)
                .mapToDouble(Movie::getImdbRating)
                .average()
                .orElse(0.0);
        overallAverageRating = Math.round(overallAverageRating * 100.0) / 100.0;

        return MovieStatsResponse.builder()
                .genreDistribution(genreDistribution)
                .averageRatingByGenre(averageRatingByGenre)
                .averageRuntimeByYear(averageRuntimeByYear)
                .overallAverageRating(overallAverageRating)
                .totalMovies((long) allMovies.size())
                .build();
    }

    @CacheEvict(value = {"movies", "movieStats"}, allEntries = true)
    @Transactional
    public void deleteMovie(String imdbId) {
        Movie movie = movieRepository.findByImdbId(imdbId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + imdbId));
        
        // Remove from cache
        movieRepository.delete(movie);
        
        // Add to blacklist to prevent re-caching
        BlacklistedMovie blacklistedMovie = BlacklistedMovie.builder()
                .imdbId(imdbId)
                .reason("Deleted by admin")
                .createdBy("admin")
                .build();
        blacklistedMovieRepository.save(blacklistedMovie);
        
        log.info("Deleted movie from cache and added to blacklist: {}", imdbId);
    }

    @CacheEvict(value = {"movies", "movieStats"}, allEntries = true)
    @Transactional
    public MovieResponse updateMovie(String imdbId, Movie updatedMovie) {
        Movie movie = movieRepository.findByImdbId(imdbId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with ID: " + imdbId));

        // Update fields
        if (updatedMovie.getTitle() != null) movie.setTitle(updatedMovie.getTitle());
        if (updatedMovie.getYear() != null) movie.setYear(updatedMovie.getYear());
        if (updatedMovie.getPlot() != null) movie.setPlot(updatedMovie.getPlot());
        if (updatedMovie.getDirector() != null) movie.setDirector(updatedMovie.getDirector());
        if (updatedMovie.getActors() != null) movie.setActors(updatedMovie.getActors());
        if (updatedMovie.getGenre() != null) movie.setGenre(updatedMovie.getGenre());
        if (updatedMovie.getRated() != null) movie.setRated(updatedMovie.getRated());
        if (updatedMovie.getRuntime() != null) movie.setRuntime(updatedMovie.getRuntime());
        if (updatedMovie.getLanguage() != null) movie.setLanguage(updatedMovie.getLanguage());
        if (updatedMovie.getCountry() != null) movie.setCountry(updatedMovie.getCountry());
        if (updatedMovie.getAwards() != null) movie.setAwards(updatedMovie.getAwards());
        if (updatedMovie.getPoster() != null) movie.setPoster(updatedMovie.getPoster());
        if (updatedMovie.getImdbRating() != null) movie.setImdbRating(updatedMovie.getImdbRating());

        movie = movieRepository.save(movie);
        log.info("Updated movie in cache: {}", imdbId);

        return MovieResponse.fromEntity(movie);
    }

    @CacheEvict(value = "movieStats", allEntries = true)
    private void fetchAndCacheMoviesFromApi(String query) {
        try {
            Optional<OmdbSearchResponse> searchResponse = omdbApiService.searchMovies(query, 1);
            
            if (searchResponse.isPresent() && searchResponse.get().getSearch() != null) {
                for (OmdbSearchResult result : searchResponse.get().getSearch()) {
                    // Only fetch details if not already cached and not blacklisted
                    if (!movieRepository.existsByImdbId(result.getImdbID()) && 
                        !blacklistedMovieRepository.existsByImdbId(result.getImdbID())) {
                        Optional<OmdbMovieDetail> detailOpt = omdbApiService.getMovieDetails(result.getImdbID());
                        detailOpt.ifPresent(detail -> {
                            Movie movie = convertOmdbDetailToMovie(detail);
                            movieRepository.save(movie);
                            log.info("Cached movie: {} ({})", movie.getTitle(), movie.getImdbId());
                        });
                        
                        // Add small delay to avoid rate limiting
                        Thread.sleep(100);
                    } else if (blacklistedMovieRepository.existsByImdbId(result.getImdbID())) {
                        log.debug("Skipping blacklisted movie: {}", result.getImdbID());
                    }
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Movie caching interrupted");
        } catch (Exception e) {
            log.error("Error fetching movies from API", e);
            // Don't throw exception, just log it - we can still return cached results
        }
    }

    private Movie convertOmdbDetailToMovie(OmdbMovieDetail omdbMovie) {
        return Movie.builder()
                .imdbId(omdbMovie.getImdbID())
                .title(omdbMovie.getTitle())
                .year(parseYear(omdbMovie.getYear()))
                .plot(omdbMovie.getPlot())
                .director(omdbMovie.getDirector())
                .actors(parseCommaSeparated(omdbMovie.getActors()))
                .genre(parseCommaSeparated(omdbMovie.getGenre()))
                .rated(omdbMovie.getRated())
                .runtime(parseRuntime(omdbMovie.getRuntime()))
                .language(omdbMovie.getLanguage())
                .country(omdbMovie.getCountry())
                .awards(omdbMovie.getAwards())
                .poster(omdbMovie.getPoster())
                .imdbRating(parseRating(omdbMovie.getImdbRating()))
                .imdbVotes(omdbMovie.getImdbVotes())
                .type(omdbMovie.getType())
                .dvd(omdbMovie.getDvd())
                .boxOffice(omdbMovie.getBoxOffice())
                .production(omdbMovie.getProduction())
                .website(omdbMovie.getWebsite())
                .cachedAt(LocalDateTime.now())
                .build();
    }

    private Integer parseYear(String yearStr) {
        if (yearStr == null || yearStr.equals("N/A")) return null;
        try {
            // Handle ranges like "2019-2021"
            return Integer.parseInt(yearStr.split("–")[0].split("-")[0].trim());
        } catch (NumberFormatException e) {
            log.warn("Could not parse year: {}", yearStr);
            return null;
        }
    }

    private Integer parseRuntime(String runtimeStr) {
        if (runtimeStr == null || runtimeStr.equals("N/A")) return null;
        try {
            // Extract number from "136 min"
            return Integer.parseInt(runtimeStr.replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            log.warn("Could not parse runtime: {}", runtimeStr);
            return null;
        }
    }

    private Double parseRating(String ratingStr) {
        if (ratingStr == null || ratingStr.equals("N/A")) return null;
        try {
            return Double.parseDouble(ratingStr);
        } catch (NumberFormatException e) {
            log.warn("Could not parse rating: {}", ratingStr);
            return null;
        }
    }

    private List<String> parseCommaSeparated(String str) {
        if (str == null || str.equals("N/A")) return new ArrayList<>();
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private Sort buildSort(String sortBy, String order) {
        if (sortBy == null || sortBy.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "cachedAt");
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(order) 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;

        return switch (sortBy.toLowerCase()) {
            case "rating" -> Sort.by(direction, "imdbRating");
            case "year" -> Sort.by(direction, "year");
            case "title" -> Sort.by(direction, "title");
            case "runtime" -> Sort.by(direction, "runtime");
            default -> Sort.by(Sort.Direction.DESC, "cachedAt");
        };
    }
}

