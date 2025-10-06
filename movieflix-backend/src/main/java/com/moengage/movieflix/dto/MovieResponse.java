package com.moengage.movieflix.dto;

import com.moengage.movieflix.entity.Movie;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {
    private String imdbId;
    private String title;
    private Integer year;
    private String plot;
    private String director;
    private List<String> actors;
    private List<String> genre;
    private String rated;
    private Integer runtime;
    private String language;
    private String country;
    private String awards;
    private String poster;
    private Double imdbRating;
    private String imdbVotes;
    private String type;
    private LocalDateTime cachedAt;

    public static MovieResponse fromEntity(Movie movie) {
        return MovieResponse.builder()
                .imdbId(movie.getImdbId())
                .title(movie.getTitle())
                .year(movie.getYear())
                .plot(movie.getPlot())
                .director(movie.getDirector())
                .actors(movie.getActors())
                .genre(movie.getGenre())
                .rated(movie.getRated())
                .runtime(movie.getRuntime())
                .language(movie.getLanguage())
                .country(movie.getCountry())
                .awards(movie.getAwards())
                .poster(movie.getPoster())
                .imdbRating(movie.getImdbRating())
                .imdbVotes(movie.getImdbVotes())
                .type(movie.getType())
                .cachedAt(movie.getCachedAt())
                .build();
    }
}

