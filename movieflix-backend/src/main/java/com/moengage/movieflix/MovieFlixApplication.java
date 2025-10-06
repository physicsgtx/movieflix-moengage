package com.moengage.movieflix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MovieFlixApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieFlixApplication.class, args);
    }
}

