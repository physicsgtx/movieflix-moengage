package com.moengage.movieflix.repository;

import com.moengage.movieflix.entity.BlacklistedMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlacklistedMovieRepository extends JpaRepository<BlacklistedMovie, Long> {
    Optional<BlacklistedMovie> findByImdbId(String imdbId);
    boolean existsByImdbId(String imdbId);
}
