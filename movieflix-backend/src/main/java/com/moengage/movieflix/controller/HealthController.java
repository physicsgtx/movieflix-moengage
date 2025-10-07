package com.moengage.movieflix.controller;

import com.moengage.movieflix.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Slf4j
@Tag(name = "Health Check", description = "Application health monitoring endpoints")
public class HealthController {

    @Autowired(required = false)
    private HealthIndicator dbHealthIndicator;

    @GetMapping
    @Operation(
            summary = "Basic health check",
            description = """
                    Simple health check endpoint that returns application status.
                    This endpoint is designed to be lightweight and fast for monitoring services.
                    
                    **Returns:**
                    - Application status
                    - Current timestamp
                    - Basic system information
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Application is healthy",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        log.debug("Health check request received");
        
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        healthData.put("service", "MovieFlix Backend");
        healthData.put("version", "1.0.0");
        
        return ResponseEntity.ok(ApiResponse.success(healthData));
    }

    @GetMapping("/detailed")
    @Operation(
            summary = "Detailed health check",
            description = """
                    Comprehensive health check including database connectivity and system status.
                    This endpoint provides more detailed information about application health.
                    
                    **Includes:**
                    - Application status
                    - Database connectivity
                    - System metrics
                    - Timestamp
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Detailed health information retrieved",
                    content = @Content(schema = @Schema(implementation = ApiResponse.class))
            )
    })
    public ResponseEntity<ApiResponse<Map<String, Object>>> detailedHealthCheck() {
        log.debug("Detailed health check request received");
        
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("status", "UP");
        healthData.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        healthData.put("service", "MovieFlix Backend");
        healthData.put("version", "1.0.0");
        
        // Check database health if available
        if (dbHealthIndicator != null) {
            try {
                Health dbHealth = dbHealthIndicator.health();
                healthData.put("database", dbHealth.getStatus().getCode());
            } catch (Exception e) {
                log.warn("Database health check failed", e);
                healthData.put("database", "DOWN");
            }
        } else {
            healthData.put("database", "N/A");
        }
        
        // Add system information
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> systemInfo = new HashMap<>();
        systemInfo.put("freeMemory", runtime.freeMemory());
        systemInfo.put("totalMemory", runtime.totalMemory());
        systemInfo.put("maxMemory", runtime.maxMemory());
        systemInfo.put("availableProcessors", runtime.availableProcessors());
        healthData.put("system", systemInfo);
        
        return ResponseEntity.ok(ApiResponse.success(healthData));
    }

    @GetMapping("/ping")
    @Operation(
            summary = "Simple ping endpoint",
            description = """
                    Ultra-lightweight ping endpoint for keep-alive monitoring.
                    Returns minimal response for external monitoring services.
                    """
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Pong response"
            )
    })
    public ResponseEntity<String> ping() {
        log.debug("Ping request received");
        return ResponseEntity.ok("pong");
    }
}
