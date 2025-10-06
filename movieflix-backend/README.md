# MovieFlix Backend

Spring Boot REST API for MovieFlix application with JWT authentication, OMDb API integration, and comprehensive movie management.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** (Production) / **H2** (Development)
- **OpenAPI/Swagger** for API documentation
- **Maven** for dependency management

## Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL (for production) or H2 (for development)

### Running the Application

1. **Configure environment variables:**
   ```bash
   export OMDB_API_KEY=your_omdb_api_key
   export JWT_SECRET=your_jwt_secret_key
   ```

2. **Run with Maven:**
   ```bash
   mvn spring-boot:run
   ```

3. **Access the application:**
   - API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - H2 Console: http://localhost:8080/h2-console

### Building for Production

```bash
mvn clean package -DskipTests
java -jar target/movieflix-backend-1.0.0.jar
```

## API Documentation

Once running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## Default Users

- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`

## Features

- ✅ JWT-based authentication
- ✅ Movie search with advanced filters
- ✅ OMDb API integration with caching
- ✅ Admin movie management (update/delete)
- ✅ Movie statistics and analytics
- ✅ Pagination and sorting
- ✅ Comprehensive error handling
- ✅ OpenAPI/Swagger documentation

## Project Structure

```
movieflix-backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/moengage/movieflix/
│       │       ├── config/          # Configuration classes
│       │       ├── controller/      # REST controllers
│       │       ├── dto/             # Data Transfer Objects
│       │       ├── entity/          # JPA entities
│       │       ├── exception/       # Custom exceptions
│       │       ├── repository/      # JPA repositories
│       │       ├── security/        # Security configuration
│       │       ├── service/         # Business logic
│       │       └── specification/   # JPA specifications
│       └── resources/
│           ├── application.yml       # Main configuration
│           └── application-prod.yml  # Production configuration
├── pom.xml                          # Maven configuration
└── README.md                        # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OMDB_API_KEY` | OMDb API key for movie data | f1223943 |
| `JWT_SECRET` | Secret key for JWT token signing | (generated) |
| `DATABASE_URL` | PostgreSQL connection URL | - |
| `PORT` | Application port | 8080 |

## Contributing

See the main project README for contribution guidelines.

## License

This project is part of the MoEngage assignment.

