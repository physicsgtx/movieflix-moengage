package com.moengage.movieflix.controller;

import com.moengage.movieflix.dto.ApiResponse;
import com.moengage.movieflix.dto.MovieListResponse;
import com.moengage.movieflix.dto.MovieResponse;
import com.moengage.movieflix.dto.MovieSearchRequest;
import com.moengage.movieflix.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Movies", description = "Movie search, filtering, and details endpoints")
@SecurityRequirement(name = "bearerAuth")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    @Operation(
            summary = "Search and filter movies",
            description = """
                    Search for movies with advanced filtering, sorting, and pagination.
                    First search fetches from OMDb API and caches results. Subsequent searches use cache.
                    
                    **Examples:**
                    - Search: `?search=Batman`
                    - Filter by genre: `?search=Action&genres=Action&genres=Sci-Fi`
                    - Sort by rating: `?search=Movie&sort=rating&order=desc`
                    - Filter by year: `?search=2000&minYear=2000&maxYear=2020`
                    - Pagination: `?search=Batman&page=0&size=20`
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Movies retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token required"
            )
    })
    public ResponseEntity<ApiResponse<MovieListResponse>> searchMovies(
            @Parameter(description = "Search query for movie title", example = "Matrix")
            @RequestParam(required = false) String search,
            
            @Parameter(description = "Sort field: rating, year, title, runtime", example = "rating")
            @RequestParam(required = false) String sort,
            
            @Parameter(description = "Sort order: asc or desc", example = "desc")
            @RequestParam(required = false) String order,
            
            @Parameter(description = "Filter by genres (can specify multiple)", example = "[\"Action\", \"Sci-Fi\"]")
            @RequestParam(required = false) List<String> genres,
            
            @Parameter(description = "Minimum release year", example = "2000")
            @RequestParam(required = false) Integer minYear,
            
            @Parameter(description = "Maximum release year", example = "2020")
            @RequestParam(required = false) Integer maxYear,
            
            @Parameter(description = "Minimum IMDb rating", example = "7.0")
            @RequestParam(required = false) Double minRating,
            
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(required = false, defaultValue = "0") Integer page,
            
            @Parameter(description = "Page size", example = "10")
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        log.info("Search movies request: search={}, sort={}, order={}, genres={}, page={}, size={}",
                search, sort, order, genres, page, size);

        MovieSearchRequest request = MovieSearchRequest.builder()
                .search(search)
                .sort(sort)
                .order(order)
                .genres(genres)
                .minYear(minYear)
                .maxYear(maxYear)
                .minRating(minRating)
                .page(page)
                .size(size)
                .build();

        MovieListResponse response = movieService.searchMovies(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{imdbId}")
    @Operation(
            summary = "Get movie details by IMDb ID",
            description = """
                    Retrieve detailed information for a specific movie. If not in cache, fetches from OMDb API.
                    
                    **Popular IMDb IDs to try:**
                    - tt0133093 - The Matrix (1999)
                    - tt0468569 - The Dark Knight (2008)
                    - tt1375666 - Inception (2010)
                    - tt0816692 - Interstellar (2014)
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Movie details retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Movie not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token required"
            )
    })
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(
            @Parameter(description = "IMDb ID of the movie", example = "tt0133093", required = true)
            @PathVariable String imdbId
    ) {
        log.info("Get movie by ID: {}", imdbId);
        MovieResponse response = movieService.getMovieById(imdbId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

