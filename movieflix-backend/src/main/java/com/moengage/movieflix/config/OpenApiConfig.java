package com.moengage.movieflix.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "MovieFlix API",
                version = "1.0.0",
                description = """
                        # MovieFlix Backend API Documentation
                        
                        A comprehensive movie dashboard API that integrates with OMDb API to fetch, cache, and serve movie data.
                        
                        ## Features
                        - 🎬 Search movies by title with advanced filtering
                        - 📊 Get detailed movie information
                        - 📈 View statistics and analytics
                        - 🔐 JWT-based authentication
                        - 👤 User and Admin roles
                        - 💾 Smart caching system (24-hour expiry)
                        
                        ## Authentication
                        1. Register a new user via `/api/auth/register` or use default credentials
                        2. Login via `/api/auth/login` to get JWT token
                        3. Click the 🔓 **Authorize** button above and enter: `Bearer YOUR_TOKEN`
                        4. Now you can access protected endpoints!
                        
                        ## Default Credentials
                        **Admin:** username=`admin`, password=`admin123`  
                        **User:** username=`user`, password=`user123`
                        
                        ## Rate Limits
                        - OMDb API: 1,000 requests/day (free tier)
                        - Caching reduces API calls significantly
                        """,
                contact = @Contact(
                        name = "MovieFlix Support",
                        email = "support@movieflix.com"
                ),
                license = @License(
                        name = "MIT License",
                        url = "https://opensource.org/licenses/MIT"
                )
        ),
        servers = {
                @Server(
                        description = "Production (Render)",
                        url = "https://movieflix-moengage.onrender.com"
                ),
                @Server(
                        description = "Local Development",
                        url = "http://localhost:8080"
                )
        },
        security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT authentication. Login to get your token, then click 'Authorize' and enter: Bearer {token}",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}

