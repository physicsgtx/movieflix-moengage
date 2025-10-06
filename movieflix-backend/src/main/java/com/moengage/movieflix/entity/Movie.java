package com.moengage.movieflix.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "movies", indexes = {
    @Index(name = "idx_imdb_id", columnList = "imdbId", unique = true),
    @Index(name = "idx_title", columnList = "title"),
    @Index(name = "idx_cached_at", columnList = "cachedAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String imdbId;

    @Column(nullable = false)
    private String title;

    @Column(name = "release_year", nullable = false)
    private Integer year;

    @Column(length = 2000)
    private String plot;

    private String director;

    @ElementCollection
    @CollectionTable(name = "movie_actors", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "actor")
    private List<String> actors;

    @ElementCollection
    @CollectionTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genre")
    private List<String> genre;

    private String rated;

    private Integer runtime; // in minutes

    private String language;

    private String country;

    private String awards;

    private String poster;

    private Double imdbRating;

    private String imdbVotes;

    private String type; // movie, series, episode

    private String dvd;

    private String boxOffice;

    private String production;

    private String website;

    @Column(nullable = false)
    private LocalDateTime cachedAt;

    @PrePersist
    protected void onCreate() {
        cachedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        cachedAt = LocalDateTime.now();
    }
}

