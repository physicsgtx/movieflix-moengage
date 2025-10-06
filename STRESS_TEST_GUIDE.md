# 🧪 MovieFlix Stress Test Guide

## Overview
Comprehensive stress testing tool for the MovieFlix backend API. Tests performance, concurrency, and reliability under load.

## What It Tests

### 📋 Test Scenarios

1. **Authentication Test**
   - Admin login
   - User login
   - Token validation

2. **Basic API Endpoints**
   - Browse all movies
   - Search movies
   - Get movie details
   - Get statistics

3. **Concurrent User Load**
   - Simulates 10 concurrent users (configurable)
   - Each user performs 5 requests
   - Random search queries
   - Movie detail lookups

4. **Rapid Requests Stress**
   - 20 simultaneous requests
   - Tests rate limiting
   - Database connection pool

### 📊 Metrics Collected

- **Total Requests**: Count of all API calls
- **Success Rate**: Percentage of successful requests
- **Response Times**: Min, Max, Average
- **Requests per Second**: Throughput
- **Error Analysis**: Detailed error reporting

## 🚀 How to Run

### Prerequisites
```bash
# Install Node.js (v18 or higher)
node --version

# Install dependencies
npm install axios
```

### Quick Start

**Test Production (Render):**
```bash
node stress-test.js
```

**Test Local Development:**
```bash
API_URL=http://localhost:8080 node stress-test.js
```

**Using npm scripts (after renaming package.json):**
```bash
# First, rename the package file
mv stress-test-package.json package.json

# Install dependencies
npm install

# Run tests
npm test                # Production
npm run test:local      # Local
npm run test:production # Production (explicit)
```

### Configuration

Edit the `CONFIG` object in `stress-test.js`:

```javascript
const CONFIG = {
  concurrentUsers: 10,        // Number of simultaneous users
  requestsPerUser: 5,         // Requests each user makes
  searchQueries: [...],       // Movie search terms
  movieIds: [...]             // Movie IDs to test
};
```

### Environment Variables

```bash
# API URL (default: production)
API_URL=https://movieflix-moengage.onrender.com

# Example: Test local backend
export API_URL=http://localhost:8080
node stress-test.js
```

## 📈 Sample Output

```
🚀 MovieFlix API Stress Test Starting...
📊 Target: https://movieflix-moengage.onrender.com
📊 Concurrent Users: 10
📊 Requests per User: 5

🧪 TEST 1: Authentication
✅ Login successful for admin: admin (234ms)
✅ Authentication successful for admin and user

🧪 TEST 2: Basic API Endpoints
✅ Browse all movies: 45 total (567ms)
✅ Search "Matrix": 12 movies found in 423ms
✅ Movie details for tt0133093: The Matrix (345ms)
✅ Stats retrieved: 45 movies (189ms)

🧪 TEST 3: Concurrent User Load
🧪 User #1 started
🧪 User #2 started
...
✅ User #1 completed in 3456ms
✅ User #2 completed in 3512ms

🧪 TEST 4: Rapid Requests Stress Test
✅ Rapid requests completed

═══════════════════════════════════════════
           STRESS TEST RESULTS             
═══════════════════════════════════════════

📊 Total Requests:          234
✅ Successful:              232
❌ Failed:                  2
📈 Success Rate:            99.15%
⏱️  Total Duration:          45.67s
⚡ Avg Response Time:       456.23ms
🐌 Min Response Time:       123.45ms
🚀 Max Response Time:       2345.67ms
🔄 Requests per Second:     5.12

🏆 EXCELLENT: Average response time under 500ms!
🏆 EXCELLENT: Success rate above 95%!
```

## 🎯 Performance Benchmarks

### Response Time
- **Excellent**: < 500ms average
- **Good**: 500ms - 1000ms
- **Acceptable**: 1s - 2s
- **Poor**: > 2s

### Success Rate
- **Excellent**: ≥ 95%
- **Good**: 90% - 95%
- **Needs Improvement**: < 90%

### Expected Results

**Production (Render Free Tier):**
- Average: 500ms - 1500ms (cold start)
- After warmup: 300ms - 800ms
- Success Rate: > 95%

**Local Development:**
- Average: 50ms - 200ms
- Success Rate: > 99%

## 🔍 Troubleshooting

### High Response Times
- **Cold Start**: First request after 15min inactivity takes 30-60s on Render
- **Database**: Check PostgreSQL connection pool
- **External API**: OMDb API rate limiting (1000/day)

### Failed Requests
- **401 Unauthorized**: Check credentials (admin/admin123, user/user123)
- **500 Server Error**: Check backend logs
- **Timeout**: Increase axios timeout in script

### Connection Issues
```bash
# Test connectivity
curl https://movieflix-moengage.onrender.com/actuator/health

# Check if backend is deployed
curl https://movieflix-moengage.onrender.com/swagger-ui/index.html
```

## 🛠️ Customization

### Add More Tests

```javascript
async function testCustomEndpoint(token) {
  const response = await axios.get(`${BASE_URL}/api/custom`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Your assertions
}

// Add to runStressTest()
await testCustomEndpoint(userToken);
```

### Heavy Load Test

Modify for heavier testing:

```javascript
const CONFIG = {
  concurrentUsers: 50,     // More users
  requestsPerUser: 20,     // More requests
  // ... more config
};
```

## 📝 Notes

- **Rate Limiting**: OMDb API has 1000 requests/day limit (free tier)
- **Render Free Tier**: Spins down after 15min inactivity
- **First Request**: May take 30-60s (cold start)
- **Caching**: Subsequent requests use cached data (faster)

## 🎓 Understanding Results

### Good Performance
```
✅ 99% success rate
⚡ 400ms average response
🚀 10 req/s throughput
```

### Needs Investigation
```
⚠️  80% success rate
🐌 2000ms average response
⚠️  2 req/s throughput
```

### What to Check
1. Response times > 2s → Database queries, external API
2. Success rate < 90% → Authentication, server errors
3. High min response → Cold start, network latency
4. Increasing failures → Rate limiting, memory issues

## 🚀 CI/CD Integration

Add to GitHub Actions:

```yaml
- name: Stress Test API
  run: |
    npm install axios
    API_URL=${{ secrets.API_URL }} node stress-test.js
```

## 📞 Support

If stress test reveals issues:
1. Check backend logs in Render dashboard
2. Verify database connectivity
3. Check OMDb API quota
4. Review Spring Boot metrics

---

**Happy Testing! 🧪**

