# 📁 MovieFlix Project Structure

Complete directory structure of the MovieFlix application.

## Overview

```
Moengage Assignment/
├── movieflix-backend/          # Spring Boot REST API (Port 8080)
├── movieflix-frontend/         # React + Vite SPA (Port 3000)
├── docker-compose.yml          # Docker orchestration
└── Documentation/              # Project documentation files
```

## Backend Structure

```
movieflix-backend/
├── src/
│   ├── main/
│   │   ├── java/com/moengage/movieflix/
│   │   │   ├── config/
│   │   │   │   ├── DataInitializer.java         # Initialize default users
│   │   │   │   └── OpenApiConfig.java           # Swagger configuration
│   │   │   │
│   │   │   ├── controller/                      # REST Controllers
│   │   │   │   ├── AdminController.java         # Admin movie management
│   │   │   │   ├── AuthController.java          # Authentication endpoints
│   │   │   │   ├── MovieController.java         # Movie search & details
│   │   │   │   └── StatsController.java         # Analytics endpoints
│   │   │   │
│   │   │   ├── dto/                             # Data Transfer Objects
│   │   │   │   ├── ApiResponse.java             # Generic API response
│   │   │   │   ├── AuthRequest.java             # Login request
│   │   │   │   ├── AuthResponse.java            # Auth response with tokens
│   │   │   │   ├── MovieListResponse.java       # Paginated movie list
│   │   │   │   ├── MovieResponse.java           # Single movie response
│   │   │   │   ├── MovieSearchRequest.java      # Search parameters
│   │   │   │   ├── MovieStatsResponse.java      # Analytics response
│   │   │   │   ├── RefreshTokenRequest.java     # Token refresh request
│   │   │   │   ├── RegisterRequest.java         # Registration request
│   │   │   │   └── omdb/                        # OMDb API DTOs
│   │   │   │       ├── OmdbMovieDetail.java
│   │   │   │       ├── OmdbSearchResponse.java
│   │   │   │       └── OmdbSearchResult.java
│   │   │   │
│   │   │   ├── entity/                          # JPA Entities
│   │   │   │   ├── Movie.java                   # Movie entity
│   │   │   │   ├── RefreshToken.java            # Refresh token entity
│   │   │   │   └── User.java                    # User entity with roles
│   │   │   │
│   │   │   ├── exception/                       # Custom Exceptions
│   │   │   │   ├── BadRequestException.java
│   │   │   │   ├── ExternalApiException.java
│   │   │   │   ├── GlobalExceptionHandler.java  # Global error handler
│   │   │   │   └── ResourceNotFoundException.java
│   │   │   │
│   │   │   ├── repository/                      # JPA Repositories
│   │   │   │   ├── MovieRepository.java
│   │   │   │   ├── RefreshTokenRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   │
│   │   │   ├── security/                        # Security Configuration
│   │   │   │   ├── JwtAuthenticationEntryPoint.java
│   │   │   │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   │   │   ├── JwtUtil.java                 # JWT utilities
│   │   │   │   ├── SecurityConfig.java          # Spring Security config
│   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   │
│   │   │   ├── service/                         # Business Logic
│   │   │   │   ├── AuthService.java             # Authentication service
│   │   │   │   ├── CacheCleanupService.java     # Old data cleanup
│   │   │   │   ├── MovieService.java            # Movie business logic
│   │   │   │   └── OmdbApiService.java          # OMDb API integration
│   │   │   │
│   │   │   ├── specification/                   # JPA Specifications
│   │   │   │   └── MovieSpecification.java      # Dynamic queries
│   │   │   │
│   │   │   └── MovieFlixApplication.java        # Main application
│   │   │
│   │   └── resources/
│   │       ├── application.yml                  # Development config
│   │       └── application-prod.yml             # Production config
│   │
│   └── test/                                    # Test files
│
├── target/                                      # Build output
├── pom.xml                                      # Maven configuration
├── Dockerfile                                   # Backend Docker image
├── Procfile                                     # Heroku deployment
├── system.properties                            # Java version for Heroku
└── README.md                                    # Backend documentation
```

## Frontend Structure

```
movieflix-frontend/
├── src/
│   ├── components/                              # React Components
│   │   ├── EditMovieModal.jsx                   # Admin edit modal
│   │   └── Navbar.jsx                           # Navigation bar
│   │
│   ├── pages/                                   # Page Components
│   │   ├── Dashboard.jsx                        # Analytics dashboard
│   │   ├── Home.jsx                             # Landing page (Netflix-style)
│   │   ├── Login.jsx                            # Login page
│   │   ├── MovieDetails.jsx                     # Movie details page
│   │   ├── Movies.jsx                           # Movie listing (with filters)
│   │   └── Register.jsx                         # Registration page
│   │
│   ├── services/
│   │   └── api.js                               # Axios configuration & API calls
│   │
│   ├── store/
│   │   └── authStore.js                         # Zustand auth store
│   │
│   ├── App.jsx                                  # Main app component
│   ├── main.jsx                                 # React entry point
│   └── index.css                                # Global styles (Tailwind)
│
├── public/                                      # Static assets
├── index.html                                   # HTML entry point
├── package.json                                 # NPM dependencies
├── vite.config.js                               # Vite configuration
├── tailwind.config.js                           # Tailwind CSS config
├── postcss.config.js                            # PostCSS config
├── README.md                                    # Frontend documentation
├── SETUP_COMPLETE.md                            # Setup guide
└── START.md                                     # Quick start guide
```

## Documentation Files

```
Root Directory Documentation/
├── README.md                   # Main project README
├── PROJECT_STRUCTURE.md        # This file
├── API_EXAMPLES.md             # cURL examples for all endpoints
├── SWAGGER_GUIDE.md            # How to use Swagger UI
├── DEPLOYMENT.md               # Production deployment guide
├── GETTING_STARTED.md          # Quick start guide
├── QUICK_START.md              # Minimal quick start
├── FEATURES.md                 # Feature list
├── Assignment.txt              # Original assignment
├── docker-compose.yml          # Docker orchestration
└── example.env                 # Environment variables template
```

## Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `pom.xml` | Maven dependencies and build configuration |
| `application.yml` | Application properties (database, JWT, OMDb) |
| `SecurityConfig.java` | Spring Security + JWT configuration |
| `MovieService.java` | Core movie business logic |
| `OmdbApiService.java` | External API integration |
| `JwtUtil.java` | JWT token generation and validation |

### Frontend

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies and scripts |
| `vite.config.js` | Vite dev server and build config |
| `tailwind.config.js` | Tailwind CSS customization |
| `api.js` | Axios instance with JWT interceptors |
| `authStore.js` | Authentication state management |
| `Movies.jsx` | Main movie listing with filters & CSV export |

## Technology Breakdown

### Backend Dependencies (pom.xml)
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- PostgreSQL Driver
- H2 Database
- JJWT (JSON Web Token)
- SpringDoc OpenAPI (Swagger)
- Lombok
- WebFlux (for OMDb API calls)

### Frontend Dependencies (package.json)
- React 18
- React Router DOM
- Axios
- Zustand (state management)
- Recharts (data visualization)
- Lucide React (icons)
- React Hot Toast (notifications)
- Tailwind CSS
- Vite (build tool)

## Environment Files

### Backend (.env or environment variables)
```
OMDB_API_KEY=f1223943
JWT_SECRET=your-secret-key-here
DATABASE_URL=jdbc:postgresql://localhost:5432/movieflix
PORT=8080
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080
```

## Build Outputs

### Backend
```
target/
├── classes/                    # Compiled .class files
├── movieflix-backend-1.0.0.jar # Executable JAR
└── maven-archiver/             # Maven metadata
```

### Frontend
```
dist/
├── assets/                     # Bundled JS/CSS with hashes
├── index.html                  # Optimized HTML
└── vite.svg                    # Favicon
```

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend API | 8080 | http://localhost:8080 |
| Frontend Dev | 3000 | http://localhost:3000 |
| Swagger UI | 8080 | http://localhost:8080/swagger-ui.html |
| H2 Console | 8080 | http://localhost:8080/h2-console |

## Database Tables

```
H2 / PostgreSQL Schema:

movies
├── imdb_id (PK)
├── title
├── year (release_year)
├── rated
├── runtime
├── genre (array/json)
├── director
├── actors (array/json)
├── plot
├── language
├── country
├── awards
├── poster
├── imdb_rating
├── imdb_votes
├── type
└── cached_at

users
├── id (PK)
├── username (unique)
├── email (unique)
├── password (encrypted)
├── role (USER/ADMIN)
├── created_at
└── updated_at

refresh_tokens
├── id (PK)
├── token (unique)
├── user_id (FK)
└── expiry_date
```

---

**Last Updated:** October 6, 2025  
**Project:** MovieFlix - MoEngage Assignment
