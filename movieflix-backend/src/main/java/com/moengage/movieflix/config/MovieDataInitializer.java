package com.moengage.movieflix.config;

import com.moengage.movieflix.dto.omdb.OmdbMovieDetail;
import com.moengage.movieflix.entity.Movie;
import com.moengage.movieflix.repository.MovieRepository;
import com.moengage.movieflix.service.OmdbApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Initializes the database with popular movies on application startup
 * This provides users with content to browse immediately
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MovieDataInitializer implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final OmdbApiService omdbApiService;

    // Popular movie IMDb IDs to pre-load
    private static final List<String> POPULAR_MOVIE_IDS = Arrays.asList(
            // Classics & Highly Rated
            "tt0111161", // The Shawshank Redemption (1994) - 9.3
            "tt0068646", // The Godfather (1972) - 9.2
            "tt0468569", // The Dark Knight (2008) - 9.0
            "tt0167260", // The Lord of the Rings: Return of the King (2003) - 9.0
            "tt0110912", // Pulp Fiction (1994) - 8.9
            
            // Sci-Fi & Action
            "tt0133093", // The Matrix (1999) - 8.7
            "tt1375666", // Inception (2010) - 8.8
            "tt0816692", // Interstellar (2014) - 8.7
            "tt0109830", // Forrest Gump (1994) - 8.8
            "tt0120737", // The Lord of the Rings: Fellowship of the Ring (2001) - 8.9
            
            // Modern Blockbusters
            "tt0848228", // The Avengers (2012) - 8.0
            "tt4154756", // Avengers: Infinity War (2018) - 8.4
            "tt4154796", // Avengers: Endgame (2019) - 8.4
            "tt0407887", // The Departed (2006) - 8.5
            "tt1345836", // The Dark Knight Rises (2012) - 8.4
            
            // Popular Recent Movies
            "tt6751668", // Parasite (2019) - 8.5
            "tt8503618", // Hamilton (2020) - 8.3
            "tt10872600", // Spider-Man: No Way Home (2021) - 8.2
            "tt1160419", // Dune (2021) - 8.0
            "tt9114286", // Black Panther: Wakanda Forever (2022) - 6.7
            
            // More Variety
            "tt0137523", // Fight Club (1999) - 8.8
            "tt0120815", // Saving Private Ryan (1998) - 8.6
            "tt0167261", // The Lord of the Rings: The Two Towers (2002) - 8.8
            "tt0172495", // Gladiator (2000) - 8.5
            "tt0114369", // Se7en (1995) - 8.6
            
            // Additional Popular Titles
            "tt0102926", // The Silence of the Lambs (1991) - 8.6
            "tt0114814", // The Usual Suspects (1995) - 8.5
            "tt0118799", // Life is Beautiful (1997) - 8.6
            "tt0317248", // City of God (2002) - 8.6
            "tt0245429"  // Spirited Away (2001) - 8.6
    );

    @Override
    public void run(String... args) {
        // Check if database already has movies
        long existingCount = movieRepository.count();
        
        if (existingCount > 0) {
            log.info("Database already contains {} movies. Skipping initialization.", existingCount);
            return;
        }

        log.info("Initializing database with {} popular movies...", POPULAR_MOVIE_IDS.size());
        
        int successCount = 0;
        int failCount = 0;
        
        for (String imdbId : POPULAR_MOVIE_IDS) {
            try {
                // Check if movie already exists
                if (movieRepository.existsByImdbId(imdbId)) {
                    log.debug("Movie {} already exists, skipping", imdbId);
                    continue;
                }
                
                // Fetch movie details from OMDb API
                Optional<OmdbMovieDetail> movieDetailOpt = omdbApiService.getMovieDetails(imdbId);
                
                if (movieDetailOpt.isPresent()) {
                    OmdbMovieDetail detail = movieDetailOpt.get();
                    Movie movie = convertToEntity(detail);
                    movieRepository.save(movie);
                    successCount++;
                    log.info("✓ Loaded: {} ({})", movie.getTitle(), movie.getYear());
                } else {
                    failCount++;
                    log.warn("✗ Failed to fetch movie: {}", imdbId);
                }
                
                // Small delay to avoid rate limiting (100ms between requests)
                Thread.sleep(100);
                
            } catch (Exception e) {
                failCount++;
                log.error("Error loading movie {}: {}", imdbId, e.getMessage());
            }
        }
        
        log.info("=".repeat(60));
        log.info("Movie initialization complete!");
        log.info("Successfully loaded: {} movies", successCount);
        log.info("Failed to load: {} movies", failCount);
        log.info("Total in database: {} movies", movieRepository.count());
        log.info("=".repeat(60));
    }

    private Movie convertToEntity(OmdbMovieDetail detail) {
        return Movie.builder()
                .imdbId(detail.getImdbID())
                .title(detail.getTitle())
                .year(parseYear(detail.getYear()))
                .plot(detail.getPlot())
                .director(detail.getDirector())
                .actors(parseCommaSeparated(detail.getActors()))
                .genre(parseCommaSeparated(detail.getGenre()))
                .rated(detail.getRated())
                .runtime(parseRuntime(detail.getRuntime()))
                .language(detail.getLanguage())
                .country(detail.getCountry())
                .awards(detail.getAwards())
                .poster(detail.getPoster())
                .imdbRating(parseRating(detail.getImdbRating()))
                .imdbVotes(detail.getImdbVotes())
                .type(detail.getType())
                .dvd(detail.getDVD())
                .boxOffice(detail.getBoxOffice())
                .production(detail.getProduction())
                .website(detail.getWebsite())
                .cachedAt(LocalDateTime.now())
                .build();
    }

    private Integer parseYear(String yearStr) {
        if (yearStr == null || yearStr.equals("N/A")) return null;
        try {
            // Handle year ranges like "2019-2020" - take first year
            String year = yearStr.split("-")[0].trim();
            return Integer.parseInt(year);
        } catch (NumberFormatException e) {
            log.warn("Could not parse year: {}", yearStr);
            return null;
        }
    }

    private Integer parseRuntime(String runtimeStr) {
        if (runtimeStr == null || runtimeStr.equals("N/A")) return null;
        try {
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
        if (str == null || str.equals("N/A")) return List.of();
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}

