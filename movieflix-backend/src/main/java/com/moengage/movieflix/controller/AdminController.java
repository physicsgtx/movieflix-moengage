package com.moengage.movieflix.controller;

import com.moengage.movieflix.dto.ApiResponse;
import com.moengage.movieflix.dto.MovieResponse;
import com.moengage.movieflix.entity.Movie;
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

    @GetMapping("/test")
    @Operation(
            summary = "Test admin access",
            description = "Simple endpoint to test if admin authentication is working"
    )
    public ResponseEntity<ApiResponse<String>> testAdminAccess() {
        log.info("Admin test endpoint accessed");
        return ResponseEntity.ok(ApiResponse.success("Admin access confirmed", "OK"));
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
            summary = "Delete movie from cache (Admin only)",
            description = """
                    Remove a movie from the cache. Only ADMIN role can perform this operation.
                    
                    The movie will be re-cached on next search/fetch.
                    
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

