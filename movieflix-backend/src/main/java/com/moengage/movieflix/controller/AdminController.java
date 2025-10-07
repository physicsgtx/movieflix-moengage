package com.moengage.movieflix.controller;

import com.moengage.movieflix.dto.ApiResponse;
import com.moengage.movieflix.dto.MovieResponse;
import com.moengage.movieflix.entity.Movie;
import com.moengage.movieflix.entity.BlacklistedMovie;
import com.moengage.movieflix.exception.ResourceNotFoundException;
import com.moengage.movieflix.service.MovieService;
import com.moengage.movieflix.repository.BlacklistedMovieRepository;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/movies")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only operations for managing movie cache (requires ADMIN role)")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final MovieService movieService;
    private final BlacklistedMovieRepository blacklistedMovieRepository;

    @GetMapping("/test")
    @Operation(
            summary = "Test admin access",
            description = "Simple endpoint to test if admin authentication is working"
    )
    public ResponseEntity<ApiResponse<String>> testAdminAccess() {
        log.info("Admin test endpoint accessed");
        return ResponseEntity.ok(ApiResponse.success("Admin access confirmed", "OK"));
    }

    @GetMapping("/blacklist")
    @Operation(
            summary = "Get blacklisted movies",
            description = "Retrieve list of movies that have been permanently blacklisted"
    )
    public ResponseEntity<ApiResponse<java.util.List<BlacklistedMovie>>> getBlacklistedMovies() {
        log.info("Admin requesting blacklisted movies");
        java.util.List<BlacklistedMovie> blacklistedMovies = blacklistedMovieRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Blacklisted movies retrieved", blacklistedMovies));
    }

    @DeleteMapping("/blacklist/{imdbId}")
    @Operation(
            summary = "Remove movie from blacklist",
            description = "Remove a movie from the blacklist, allowing it to be cached again"
    )
    public ResponseEntity<ApiResponse<Void>> removeFromBlacklist(
            @Parameter(description = "IMDb ID of the movie to remove from blacklist", example = "tt0133093", required = true)
            @PathVariable String imdbId
    ) {
        log.info("Admin removing movie from blacklist: {}", imdbId);
        
        BlacklistedMovie blacklistedMovie = blacklistedMovieRepository.findByImdbId(imdbId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found in blacklist: " + imdbId));
        
        blacklistedMovieRepository.delete(blacklistedMovie);
        log.info("Movie removed from blacklist: {}", imdbId);
        
        return ResponseEntity.ok(ApiResponse.success("Movie removed from blacklist", null));
    }

    @PostMapping("/clear-cache")
    @Operation(
            summary = "Clear movie cache",
            description = "Clear all cached movies and force re-fetch from OMDb API"
    )
    public ResponseEntity<ApiResponse<Void>> clearCache() {
        log.info("Admin clearing movie cache");
        
        // Clear all movies from database
        movieService.clearAllMovies();
        
        log.info("Movie cache cleared successfully");
        return ResponseEntity.ok(ApiResponse.success("Movie cache cleared successfully", null));
    }

    @PutMapping("/{imdbId}")
    @Operation(
            summary = "Update movie in cache (Admin only)",
            description = """
                    Update cached movie details. Only ADMIN role can perform this operation.
                    
                    **Use cases:**
                    - Correct incorrect data
                    - Update ratings
                    - Modify metadata
                    
                    Login with admin credentials: username=admin, password=admin123
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Movie updated successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - ADMIN role required"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Movie not found"
            )
    })
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(
            @Parameter(description = "IMDb ID of the movie to update", example = "tt0133093", required = true)
            @PathVariable String imdbId,
            @RequestBody Movie movie
    ) {
        log.info("Admin update movie: {}", imdbId);
        MovieResponse response = movieService.updateMovie(imdbId, movie);
        return ResponseEntity.ok(ApiResponse.success("Movie updated successfully", response));
    }

    @DeleteMapping("/{imdbId}")
    @Operation(
            summary = "Delete movie permanently (Admin only)",
            description = """
                    Permanently remove a movie from the cache and blacklist it to prevent re-caching.
                    Only ADMIN role can perform this operation.
                    
                    **What happens:**
                    - Movie is removed from cache/database
                    - Movie is added to blacklist
                    - Movie will NOT be re-cached on future searches
                    - Movie can be restored by removing from blacklist
                    
                    Login with admin credentials: username=admin, password=admin123
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Movie deleted successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - ADMIN role required"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Movie not found"
            )
    })
    public ResponseEntity<ApiResponse<Void>> deleteMovie(
            @Parameter(description = "IMDb ID of the movie to delete", example = "tt0133093", required = true)
            @PathVariable String imdbId
    ) {
        log.info("Admin delete movie request received: {}", imdbId);
        log.info("Current user authentication: {}", SecurityContextHolder.getContext().getAuthentication());
        
        try {
            movieService.deleteMovie(imdbId);
            log.info("Movie deleted successfully: {}", imdbId);
            return ResponseEntity.ok(ApiResponse.success("Movie deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting movie {}: {}", imdbId, e.getMessage(), e);
            throw e;
        }
    }
}

