package com.moengage.movieflix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieStatsResponse {
    private Map<String, Long> genreDistribution;
    private Map<String, Double> averageRatingByGenre;
    private Map<Integer, Double> averageRuntimeByYear;
    private Double overallAverageRating;
    private Long totalMovies;
}

