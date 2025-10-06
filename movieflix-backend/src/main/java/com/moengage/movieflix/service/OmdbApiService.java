package com.moengage.movieflix.service;

import com.moengage.movieflix.dto.omdb.OmdbMovieDetail;
import com.moengage.movieflix.dto.omdb.OmdbSearchResponse;
import com.moengage.movieflix.exception.ExternalApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Optional;

@Service
@Slf4j
public class OmdbApiService {

    private final WebClient webClient;
    private final String apiKey;

    public OmdbApiService(
            WebClient.Builder webClientBuilder,
            @Value("${app.omdb.base-url}") String baseUrl,
            @Value("${app.omdb.api-key}") String apiKey
    ) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
    }

    public Optional<OmdbSearchResponse> searchMovies(String query, int page) {
        try {
            log.info("Searching movies from OMDb API: query={}, page={}", query, page);
            
            OmdbSearchResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("apikey", apiKey)
                            .queryParam("s", query)
                            .queryParam("page", page)
                            .build())
                    .retrieve()
                    .bodyToMono(OmdbSearchResponse.class)
                    .block();

            if (response != null && "True".equals(response.getResponse())) {
                log.info("Found {} movies for query: {}", response.getTotalResults(), query);
                return Optional.of(response);
            } else {
                log.warn("No movies found or error from OMDb API: {}", 
                        response != null ? response.getError() : "null response");
                return Optional.empty();
            }
        } catch (WebClientResponseException e) {
            log.error("Error calling OMDb API: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ExternalApiException("Failed to search movies: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error calling OMDb API", e);
            throw new ExternalApiException("Failed to search movies: " + e.getMessage());
        }
    }

    public Optional<OmdbMovieDetail> getMovieDetails(String imdbId) {
        try {
            log.info("Fetching movie details from OMDb API: imdbId={}", imdbId);
            
            OmdbMovieDetail response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("apikey", apiKey)
                            .queryParam("i", imdbId)
                            .queryParam("plot", "full")
                            .build())
                    .retrieve()
                    .bodyToMono(OmdbMovieDetail.class)
                    .block();

            if (response != null && "True".equals(response.getResponse())) {
                log.info("Successfully fetched movie details: {}", response.getTitle());
                return Optional.of(response);
            } else {
                log.warn("Movie not found or error from OMDb API: {}", 
                        response != null ? response.getError() : "null response");
                return Optional.empty();
            }
        } catch (WebClientResponseException e) {
            log.error("Error calling OMDb API: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ExternalApiException("Failed to fetch movie details: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error calling OMDb API", e);
            throw new ExternalApiException("Failed to fetch movie details: " + e.getMessage());
        }
    }
}

