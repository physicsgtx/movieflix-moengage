package com.moengage.movieflix.config;

import com.moengage.movieflix.entity.User;
import com.moengage.movieflix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@movieflix.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: username=admin, password=admin123");
        }

        // Create default regular user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = User.builder()
                    .username("user")
                    .email("user@movieflix.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(User.Role.USER)
                    .build();
            userRepository.save(user);
            log.info("Default user created: username=user, password=user123");
        }
    }
}

