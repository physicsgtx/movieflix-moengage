# MovieFlix Backend - Deployment Guide

Complete guide for deploying the MovieFlix backend to various cloud platforms.

## Table of Contents
1. [Heroku Deployment](#heroku-deployment)
2. [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
3. [Railway](#railway-deployment)
4. [Render](#render-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Environment Variables](#environment-variables)

---

## Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
heroku create movieflix-backend
```

3. **Add PostgreSQL Database**
```bash
heroku addons:create heroku-postgresql:mini
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
heroku config:set OMDB_API_KEY=your_omdb_api_key
```

5. **Create Procfile** (in root directory)
```
web: java -Dserver.port=$PORT -Dspring.profiles.active=prod $JAVA_OPTS -jar target/movieflix-backend-1.0.0.jar
```

6. **Create system.properties** (in root directory)
```
java.runtime.version=17
```

7. **Deploy**
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

8. **Open Application**
```bash
heroku open
```

9. **View Logs**
```bash
heroku logs --tail
```

### Database Migration

Heroku automatically provides `DATABASE_URL` environment variable. The application will use it automatically.

---

## AWS Elastic Beanstalk

### Prerequisites
- AWS account
- EB CLI installed
- Built JAR file

### Steps

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB Application**
```bash
eb init -p corretto-17 movieflix-backend --region us-east-1
```

3. **Create Environment**
```bash
eb create movieflix-env
```

4. **Set Environment Variables**
```bash
eb setenv JWT_SECRET=your_jwt_secret_key \
         OMDB_API_KEY=your_omdb_api_key \
         SPRING_PROFILES_ACTIVE=prod
```

5. **Add RDS Database (Optional)**
```bash
eb create --database
```

6. **Deploy**
```bash
mvn clean package -DskipTests
eb deploy
```

7. **Open Application**
```bash
eb open
```

8. **View Logs**
```bash
eb logs
```

### Configuration File

Create `.ebextensions/options.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    SERVER_PORT: 5000
  aws:elasticbeanstalk:container:tomcat:jvmoptions:
    Xmx: 512m
    Xms: 256m
```

---

## Railway Deployment

Railway is a modern platform with easy deployment.

### Steps

1. **Sign up at [Railway.app](https://railway.app)**

2. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

3. **Login**
```bash
railway login
```

4. **Initialize Project**
```bash
railway init
```

5. **Add PostgreSQL**
```bash
railway add postgresql
```

6. **Set Environment Variables**
```bash
railway variables set JWT_SECRET=your_jwt_secret_key
railway variables set OMDB_API_KEY=your_omdb_api_key
railway variables set SPRING_PROFILES_ACTIVE=prod
```

7. **Deploy**
```bash
railway up
```

### Alternative: GitHub Integration

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Automatic deployment on every push

---

## Render Deployment

### Prerequisites
- Render account
- GitHub repository

### Steps

1. **Sign up at [Render.com](https://render.com)**

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select "Java" as the environment

3. **Configure Build Settings**
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar target/movieflix-backend-1.0.0.jar`

4. **Add PostgreSQL Database**
   - Create a new PostgreSQL database in Render
   - Link it to your web service

5. **Set Environment Variables** (in Render dashboard)
```
JWT_SECRET=your_jwt_secret_key
OMDB_API_KEY=your_omdb_api_key
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<auto-populated by Render>
```

6. **Deploy**
   - Render will automatically deploy on every push to main branch

---

## Docker Deployment

### Dockerfile

Create `Dockerfile` in root directory:
```dockerfile
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/movieflix-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose (with PostgreSQL)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: movieflix
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=jdbc:postgresql://postgres:5432/movieflix
      - DB_USERNAME=postgres
      - DB_PASSWORD=password
      - JWT_SECRET=${JWT_SECRET}
      - OMDB_API_KEY=${OMDB_API_KEY}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Build and Run

```bash
# Build image
docker build -t movieflix-backend .

# Run with environment variables
docker run -p 8080:8080 \
  -e JWT_SECRET=your_secret \
  -e OMDB_API_KEY=your_api_key \
  movieflix-backend

# Or use docker-compose
docker-compose up -d
```

### Push to Docker Hub

```bash
# Tag image
docker tag movieflix-backend your-dockerhub-username/movieflix-backend:latest

# Login
docker login

# Push
docker push your-dockerhub-username/movieflix-backend:latest
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT token generation | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `OMDB_API_KEY` | OMDb API key | `abc12345` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection URL | `jdbc:h2:mem:movieflix` |
| `DB_USERNAME` | Database username | `sa` |
| `DB_PASSWORD` | Database password | (empty) |
| `PORT` | Server port | `8080` |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `default` |

### Generate JWT Secret

```bash
# Using openssl
openssl rand -base64 64

# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Using Python
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

---

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use PostgreSQL instead of H2
- [ ] Enable HTTPS/SSL
- [ ] Set up proper logging
- [ ] Configure CORS for your frontend domain
- [ ] Set up database backups
- [ ] Monitor application health
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure rate limiting
- [ ] Review and secure all endpoints
- [ ] Change default admin password
- [ ] Set up CI/CD pipeline
- [ ] Configure caching (Redis for production)
- [ ] Set up health check endpoints
- [ ] Enable database connection pooling

---

## Health Check Endpoint

Add this controller for health checks:

```java
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
```

---

## Monitoring

### Application Metrics

Add Spring Boot Actuator:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Enable endpoints in `application-prod.yml`:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

---

## Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Change port in application.yml or use environment variable
export PORT=8081
```

2. **Database Connection Failed**
```bash
# Check DATABASE_URL format
jdbc:postgresql://host:5432/database?sslmode=require
```

3. **Out of Memory**
```bash
# Increase heap size
java -Xmx512m -Xms256m -jar app.jar
```

4. **Build Failed**
```bash
# Clean and rebuild
mvn clean install -U
```

---

## Support

For issues and questions:
- Check logs: `heroku logs --tail` or `eb logs`
- Verify environment variables are set correctly
- Ensure database is accessible
- Check OMDb API quota

---

## Next Steps

After deployment:
1. Test all API endpoints
2. Set up monitoring and alerts
3. Configure backup strategy
4. Document your API
5. Set up CI/CD pipeline
6. Deploy frontend application
7. Configure custom domain
8. Enable HTTPS

