package com.moengage.movieflix.repository;

import com.moengage.movieflix.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
    
    Optional<Movie> findByImdbId(String imdbId);
    
    List<Movie> findByTitleContainingIgnoreCase(String title);
    
    @Query("SELECT m FROM Movie m WHERE m.cachedAt < :expiryTime")
    List<Movie> findExpiredMovies(LocalDateTime expiryTime);
    
    @Query("SELECT DISTINCT g FROM Movie m JOIN m.genre g")
    List<String> findAllGenres();
    
    @Query("SELECT AVG(m.imdbRating) FROM Movie m WHERE m.imdbRating IS NOT NULL")
    Double findAverageRating();
    
    boolean existsByImdbId(String imdbId);
}

