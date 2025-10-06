package com.moengage.movieflix.specification;

import com.moengage.movieflix.entity.Movie;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class MovieSpecification {

    public static Specification<Movie> titleContains(String title) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.like(
                criteriaBuilder.lower(root.get("title")), 
                "%" + title.toLowerCase() + "%"
            );
    }

    public static Specification<Movie> hasGenres(List<String> genres) {
        return (root, query, criteriaBuilder) -> {
            Join<Object, Object> genreJoin = root.join("genre");
            return genreJoin.in(genres);
        };
    }

    public static Specification<Movie> yearGreaterThanOrEqual(Integer year) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.greaterThanOrEqualTo(root.get("year"), year);
    }

    public static Specification<Movie> yearLessThanOrEqual(Integer year) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.lessThanOrEqualTo(root.get("year"), year);
    }

    public static Specification<Movie> ratingGreaterThanOrEqual(Double rating) {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.greaterThanOrEqualTo(root.get("imdbRating"), rating);
    }
}

