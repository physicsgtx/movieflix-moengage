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
public class MovieListResponse {
    private List<MovieResponse> movies;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
}

