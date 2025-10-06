package com.moengage.movieflix.service;

import com.moengage.movieflix.entity.Movie;
import com.moengage.movieflix.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheCleanupService {

    private final MovieRepository movieRepository;

    @Value("${app.cache.expiry-hours}")
    private int expiryHours;

    @Scheduled(cron = "0 0 * * * *") // Run every hour
    @Transactional
    public void cleanupExpiredCache() {
        log.info("Starting cache cleanup task");
        
        LocalDateTime expiryTime = LocalDateTime.now().minusHours(expiryHours);
        List<Movie> expiredMovies = movieRepository.findExpiredMovies(expiryTime);
        
        if (!expiredMovies.isEmpty()) {
            movieRepository.deleteAll(expiredMovies);
            log.info("Cleaned up {} expired movies from cache", expiredMovies.size());
        } else {
            log.info("No expired movies found");
        }
    }
}

