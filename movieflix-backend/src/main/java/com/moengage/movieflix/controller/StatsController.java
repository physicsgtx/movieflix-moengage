package com.moengage.movieflix.controller;

import com.moengage.movieflix.dto.ApiResponse;
import com.moengage.movieflix.dto.MovieStatsResponse;
import com.moengage.movieflix.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Statistics", description = "Movie analytics and aggregated statistics")
@SecurityRequirement(name = "bearerAuth")
public class StatsController {

    private final MovieService movieService;

    @GetMapping
    @Operation(
            summary = "Get movie statistics",
            description = """
                    Retrieve aggregated statistics and analytics for all cached movies.
                    
                    **Includes:**
                    - Genre distribution (count per genre)
                    - Average rating by genre
                    - Average runtime by year
                    - Overall average rating
                    - Total movies in cache
                    
                    Statistics are computed from cached movies only.
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Statistics retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token required"
            )
    })
    public ResponseEntity<ApiResponse<MovieStatsResponse>> getMovieStats() {
        log.info("Get movie statistics request");
        MovieStatsResponse response = movieService.getMovieStats();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

