package com.moengage.movieflix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieSearchRequest {
    private String search;
    private String sort; // rating, year, title, runtime
    private String order; // asc, desc
    private List<String> genres;
    private Integer minYear;
    private Integer maxYear;
    private Double minRating;
    private Integer page;
    private Integer size;
}

