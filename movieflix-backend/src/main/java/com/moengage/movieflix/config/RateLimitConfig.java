package com.moengage.movieflix.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate Limiting Configuration
 * Prevents API abuse and OMDb API quota exhaustion
 */
@Configuration
public class RateLimitConfig {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    /**
     * Create a rate limiter bucket for a user
     * Allows 100 requests per minute per user
     */
    public Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createNewBucket());
    }

    private Bucket createNewBucket() {
        // Allow 100 tokens per minute (burst of 20)
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * More restrictive bucket for search operations (external API)
     * Allows 20 searches per minute per user
     */
    public Bucket resolveSearchBucket(String key) {
        return cache.computeIfAbsent(key + ":search", k -> createSearchBucket());
    }

    private Bucket createSearchBucket() {
        // Allow 20 search tokens per minute
        Bandwidth limit = Bandwidth.classic(20, Refill.intervally(20, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}

