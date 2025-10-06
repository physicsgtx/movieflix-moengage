package com.moengage.movieflix.interceptor;

import com.moengage.movieflix.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Rate Limiting Interceptor
 * Limits requests per user to prevent API abuse
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitConfig rateLimitConfig;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Get user identifier
        String userId = getUserIdentifier();
        
        // Get appropriate bucket based on endpoint
        Bucket bucket;
        if (request.getRequestURI().contains("/api/movies") && request.getParameter("search") != null) {
            // More restrictive for search operations
            bucket = rateLimitConfig.resolveSearchBucket(userId);
        } else {
            // Standard rate limit for other operations
            bucket = rateLimitConfig.resolveBucket(userId);
        }

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            // Request allowed - add rate limit headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            // Rate limit exceeded
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            response.getWriter().write(String.format(
                "{\"success\":false,\"message\":\"Rate limit exceeded. Try again in %d seconds.\",\"data\":null}",
                waitForRefill
            ));
            response.setContentType("application/json");
            
            log.warn("Rate limit exceeded for user: {} on endpoint: {}", userId, request.getRequestURI());
            return false;
        }
    }

    private String getUserIdentifier() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            return authentication.getName();
        }
        return "anonymous";
    }
}

