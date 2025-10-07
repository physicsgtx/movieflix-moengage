# 🚀 MovieFlix Deployment Guide - Render

Complete guide for deploying MovieFlix to production using Render cloud platform.

## 📋 Prerequisites

- GitHub repository with your code
- OMDb API key ([Get one here](http://www.omdbapi.com/apikey.aspx))
- Render account ([Sign up here](https://render.com))

## 🌐 Live Application URLs

- **Frontend**: https://movieflix-moengage-frontend.onrender.com
- **Backend**: https://movieflix-moengage.onrender.com
- **Swagger UI**: https://movieflix-moengage.onrender.com/swagger-ui/index.html

## 🎯 Render Deployment

### Backend Deployment on Render

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service Settings**
   ```
   Name: movieflix-backend
   Environment: Docker
   Region: Oregon (US West)
   Branch: main
   Root Directory: movieflix-backend
   Dockerfile Path: movieflix-backend/Dockerfile
   ```

3. **Environment Variables**
   ```bash
   OMDB_API_KEY=your_omdb_api_key_here
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
   SPRING_PROFILES_ACTIVE=prod
   ```

4. **Database Setup (Optional)**
   - Create PostgreSQL database on Render
   - Add database URL to environment variables:
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

### Frontend Deployment on Render

1. **Create New Static Site**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Site Settings**
   ```
   Name: movieflix-frontend
   Branch: main
   Root Directory: movieflix-frontend
   Build Command: npm install && npm run build
   Publish Directory: movieflix-frontend/dist
   ```

3. **Environment Variables**
   ```bash
   VITE_API_BASE_URL=https://movieflix-moengage.onrender.com
   ```


## 🔧 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OMDB_API_KEY` | OMDb API key for movie data | ✅ Yes | `f1223943` |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes | `mySuperSecretKey123456789` |
| `SPRING_PROFILES_ACTIVE` | Spring profile | ❌ No | `prod` |
| `DATABASE_URL` | PostgreSQL connection URL | ❌ No | `postgresql://user:pass@host:port/db` |
| `PORT` | Server port | ❌ No | `8080` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | ✅ Yes | `https://movieflix-moengage.onrender.com` |


## 🔍 Troubleshooting

### Common Issues

#### 1. Frontend Can't Connect to Backend
**Problem**: CORS errors or connection refused
**Solution**: 
- Ensure `VITE_API_BASE_URL` points to correct backend URL
- Check if backend is running and accessible
- Verify CORS configuration in backend

#### 2. Backend Database Connection Issues
**Problem**: Database connection errors
**Solution**:
- Check `DATABASE_URL` format
- Ensure database is accessible from deployment platform
- Verify database credentials

#### 3. OMDb API Rate Limiting
**Problem**: API quota exceeded
**Solution**:
- Check OMDb API key validity
- Implement caching (already included)
- Consider upgrading OMDb plan

#### 4. Build Failures
**Problem**: Frontend/backend build errors
**Solution**:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

#### 5. Render Free Tier Cold Starts
**Problem**: 30-50 second delays when accessing the application after inactivity
**Solution**:
- Use the built-in keep-alive service (automatically enabled in production)
- Set up external monitoring services (see [MONITORING_SETUP.md](./MONITORING_SETUP.md))
- Run the provided keep-alive script: `npm run keep-alive`
- Consider upgrading to Render's paid plans for production use

### Health Checks

#### Backend Health Check Endpoints
```bash
# Ultra-lightweight ping (recommended for monitoring)
curl https://movieflix-moengage.onrender.com/api/health/ping

# Basic health check
curl https://movieflix-moengage.onrender.com/api/health

# Detailed health check with system info
curl https://movieflix-moengage.onrender.com/api/health/detailed
```

#### Frontend Health Check
```bash
curl https://movieflix-moengage-frontend.onrender.com
```

#### Keep-Alive Service
```bash
# Run the built-in keep-alive script
npm run keep-alive

# Or run directly
node keep-alive.js
```

## 🚀 Cold Start Mitigation Strategies

### Understanding Render Free Tier Limitations
Render's free tier instances spin down after 15 minutes of inactivity and take 30-50 seconds to spin back up. This can cause poor user experience.

### Built-in Solutions

#### 1. Automatic Keep-Alive Service
The frontend automatically pings the backend every 10 minutes when deployed to production:
- **Endpoint**: `/api/health/ping`
- **Frequency**: 10 minutes
- **Automatic**: Enabled in production builds only

#### 2. Health Check Endpoints
Multiple health check endpoints are available for monitoring:
- `/api/health/ping` - Ultra-lightweight (returns "pong")
- `/api/health` - Basic health with timestamp
- `/api/health/detailed` - Comprehensive system info

#### 3. External Keep-Alive Script
Run the provided script locally or on a VPS:
```bash
# Install and run
npm install
npm run keep-alive

# Configure with environment variables
BACKEND_URL=https://movieflix-moengage.onrender.com \
FRONTEND_URL=https://movieflix-moengage-frontend.onrender.com \
PING_INTERVAL=10 \
npm run keep-alive
```

### External Monitoring Services
Set up external monitoring services for additional reliability:

#### Recommended Services:
1. **UptimeRobot** (Free: 50 monitors, 5-min intervals)
2. **Pingdom** (Free: 1 monitor, 1-min intervals)  
3. **StatusCake** (Free: 10 monitors, 5-min intervals)
4. **Freshping** (Free: 10 monitors, 1-min intervals)

#### Setup Instructions:
See [MONITORING_SETUP.md](./MONITORING_SETUP.md) for detailed configuration.

### Best Practices

1. **Combine Strategies**: Use both built-in keep-alive and external monitoring
2. **Monitor Both Services**: Ping both frontend and backend
3. **Appropriate Intervals**: 5-10 minute intervals work well
4. **Production Considerations**: Consider upgrading to paid plans for production

### Quick Setup Checklist

- [ ] Deploy application to Render
- [ ] Verify health endpoints are working
- [ ] Set up external monitoring service
- [ ] Run keep-alive script locally or on VPS
- [ ] Test cold start recovery time
- [ ] Monitor logs for spin-down patterns

---

## 📊 Performance Optimization

### Backend Optimizations
- ✅ Connection pooling (HikariCP)
- ✅ Database indexes
- ✅ Application caching (Caffeine)
- ✅ Rate limiting (Bucket4j)
- ✅ Scheduled cache cleanup

### Frontend Optimizations
- ✅ Code splitting
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Responsive design
- ✅ CDN delivery

## 🔐 Security Considerations

### Production Security Checklist
- ✅ JWT tokens with secure secrets
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ HTTPS enforcement

### Environment Security
- Use strong, unique JWT secrets
- Keep API keys secure
- Use environment variables for secrets
- Enable HTTPS in production
- Regular security updates

## 📈 Monitoring and Logs

### Render Monitoring
- Built-in metrics and logs
- Automatic health checks
- Performance monitoring
- Error tracking

### Custom Monitoring
```bash
# Check application logs
curl https://your-backend-url.com/actuator/health

# Monitor API usage
curl https://your-backend-url.com/api/stats
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Code tested locally
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] API keys obtained
- [ ] Domain/URLs planned

### Deployment
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Environment variables set
- [ ] Health checks passing
- [ ] SSL certificates active

### Post-Deployment
- [ ] Application accessible
- [ ] API endpoints working
- [ ] Database connected
- [ ] Authentication working
- [ ] Admin features functional

## 🆘 Support

### Getting Help
- Check application logs in Render dashboard
- Review GitHub issues
- Test endpoints with Swagger UI
- Verify environment variables

### Useful Commands
```bash
# Test backend API
curl -X GET "https://your-backend-url.com/api/movies?search=matrix" \
  -H "Authorization: Bearer your_jwt_token"

# Test frontend
curl -I https://your-frontend-url.com
```

---

**🎉 Congratulations!** Your MovieFlix application is now deployed and ready for users!

For questions or issues, refer to the main [README.md](./README.md) or create an issue in the GitHub repository.
