/**
 * MovieFlix API Stress Test
 * Tests backend performance, concurrent users, and API rate limits
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_URL || 'https://movieflix-moengage.onrender.com';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const USER_USERNAME = 'user';
const USER_PASSWORD = 'user123';

// Test configuration
const CONFIG = {
  concurrentUsers: 10,
  requestsPerUser: 5,
  searchQueries: ['Matrix', 'Batman', 'Avengers', 'Star Wars', 'Inception', 'Interstellar'],
  movieIds: ['tt0133093', 'tt0468569', 'tt1375666', 'tt0816692', 'tt0167260']
};

// Statistics
const stats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalTime: 0,
  responseTimes: [],
  errors: []
};

// Utilities
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const emoji = {
    'INFO': '📊',
    'SUCCESS': '✅',
    'ERROR': '❌',
    'WARNING': '⚠️',
    'TEST': '🧪'
  }[type] || 'ℹ️';
  console.log(`${emoji} [${timestamp}] ${message}`);
}

function calculateStats() {
  const avgResponseTime = stats.responseTimes.length > 0
    ? stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length
    : 0;
  
  const minResponseTime = Math.min(...stats.responseTimes);
  const maxResponseTime = Math.max(...stats.responseTimes);
  const successRate = ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2);
  
  return {
    avgResponseTime: avgResponseTime.toFixed(2),
    minResponseTime: minResponseTime.toFixed(2),
    maxResponseTime: maxResponseTime.toFixed(2),
    successRate
  };
}

// Authentication
async function login(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username,
      password
    });
    return response.data.data.token;
  } catch (error) {
    log(`Login failed for ${username}: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Test Functions
async function testSearchMovies(token, query) {
  const startTime = Date.now();
  try {
    stats.totalRequests++;
    const response = await axios.get(`${BASE_URL}/api/movies`, {
      params: {
        search: query,
        sort: 'rating',
        order: 'desc',
        page: 0,
        size: 12
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    stats.responseTimes.push(responseTime);
    stats.successfulRequests++;
    
    const movieCount = response.data.data.totalElements;
    log(`Search "${query}": ${movieCount} movies found in ${responseTime}ms`, 'SUCCESS');
    return response.data;
  } catch (error) {
    stats.failedRequests++;
    stats.errors.push({ endpoint: 'search', query, error: error.message });
    log(`Search failed for "${query}": ${error.message}`, 'ERROR');
    throw error;
  }
}

async function testGetMovieDetails(token, imdbId) {
  const startTime = Date.now();
  try {
    stats.totalRequests++;
    const response = await axios.get(`${BASE_URL}/api/movies/${imdbId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    stats.responseTimes.push(responseTime);
    stats.successfulRequests++;
    
    log(`Movie details for ${imdbId}: ${response.data.data.title} (${responseTime}ms)`, 'SUCCESS');
    return response.data;
  } catch (error) {
    stats.failedRequests++;
    stats.errors.push({ endpoint: 'details', imdbId, error: error.message });
    log(`Get movie details failed for ${imdbId}: ${error.message}`, 'ERROR');
    throw error;
  }
}

async function testGetStats(token) {
  const startTime = Date.now();
  try {
    stats.totalRequests++;
    const response = await axios.get(`${BASE_URL}/api/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    stats.responseTimes.push(responseTime);
    stats.successfulRequests++;
    
    log(`Stats retrieved: ${response.data.data.totalMovies} movies (${responseTime}ms)`, 'SUCCESS');
    return response.data;
  } catch (error) {
    stats.failedRequests++;
    stats.errors.push({ endpoint: 'stats', error: error.message });
    log(`Get stats failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

async function testBrowseAllMovies(token) {
  const startTime = Date.now();
  try {
    stats.totalRequests++;
    const response = await axios.get(`${BASE_URL}/api/movies`, {
      params: {
        sort: 'rating',
        order: 'desc',
        page: 0,
        size: 50
      },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    stats.responseTimes.push(responseTime);
    stats.successfulRequests++;
    
    log(`Browse all movies: ${response.data.data.totalElements} total (${responseTime}ms)`, 'SUCCESS');
    return response.data;
  } catch (error) {
    stats.failedRequests++;
    stats.errors.push({ endpoint: 'browse', error: error.message });
    log(`Browse all movies failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Simulate a single user session
async function simulateUser(userId, token) {
  log(`User #${userId} started`, 'TEST');
  const userStart = Date.now();
  
  try {
    // Browse all movies
    await testBrowseAllMovies(token);
    await sleep(500);
    
    // Perform multiple searches
    for (let i = 0; i < CONFIG.requestsPerUser; i++) {
      const randomQuery = CONFIG.searchQueries[Math.floor(Math.random() * CONFIG.searchQueries.length)];
      await testSearchMovies(token, randomQuery);
      await sleep(300);
    }
    
    // Get some movie details
    const randomMovieId = CONFIG.movieIds[Math.floor(Math.random() * CONFIG.movieIds.length)];
    await testGetMovieDetails(token, randomMovieId);
    await sleep(300);
    
    // Get stats
    await testGetStats(token);
    
    const userEnd = Date.now();
    log(`User #${userId} completed in ${userEnd - userStart}ms`, 'SUCCESS');
  } catch (error) {
    log(`User #${userId} encountered errors`, 'ERROR');
  }
}

// Concurrent user simulation
async function runConcurrentUsers() {
  log(`Starting concurrent user test with ${CONFIG.concurrentUsers} users`, 'TEST');
  
  // Login once for all simulated users
  const token = await login(USER_USERNAME, USER_PASSWORD);
  
  // Create array of user simulations
  const userPromises = [];
  for (let i = 1; i <= CONFIG.concurrentUsers; i++) {
    userPromises.push(simulateUser(i, token));
  }
  
  // Run all users concurrently
  await Promise.allSettled(userPromises);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main stress test
async function runStressTest() {
  console.log('\n');
  log('🚀 MovieFlix API Stress Test Starting...', 'INFO');
  log(`Target: ${BASE_URL}`, 'INFO');
  log(`Concurrent Users: ${CONFIG.concurrentUsers}`, 'INFO');
  log(`Requests per User: ${CONFIG.requestsPerUser}`, 'INFO');
  console.log('\n');
  
  const overallStart = Date.now();
  
  try {
    // Test 1: Authentication
    log('TEST 1: Authentication', 'TEST');
    const adminToken = await login(ADMIN_USERNAME, ADMIN_PASSWORD);
    const userToken = await login(USER_USERNAME, USER_PASSWORD);
    log('Authentication successful for admin and user', 'SUCCESS');
    console.log('\n');
    
    // Test 2: Basic API endpoints
    log('TEST 2: Basic API Endpoints', 'TEST');
    await testBrowseAllMovies(userToken);
    await testSearchMovies(userToken, 'Matrix');
    await testGetMovieDetails(userToken, 'tt0133093');
    await testGetStats(userToken);
    log('Basic endpoints working correctly', 'SUCCESS');
    console.log('\n');
    
    // Test 3: Concurrent users
    log('TEST 3: Concurrent User Load', 'TEST');
    await runConcurrentUsers();
    log('Concurrent user test completed', 'SUCCESS');
    console.log('\n');
    
    // Test 4: Rapid requests (stress)
    log('TEST 4: Rapid Requests Stress Test', 'TEST');
    const rapidPromises = [];
    for (let i = 0; i < 20; i++) {
      rapidPromises.push(testBrowseAllMovies(userToken));
    }
    await Promise.allSettled(rapidPromises);
    log('Rapid requests completed', 'SUCCESS');
    console.log('\n');
    
  } catch (error) {
    log(`Test suite failed: ${error.message}`, 'ERROR');
  }
  
  const overallEnd = Date.now();
  const totalDuration = ((overallEnd - overallStart) / 1000).toFixed(2);
  
  // Print results
  const finalStats = calculateStats();
  
  console.log('\n');
  log('═══════════════════════════════════════════', 'INFO');
  log('           STRESS TEST RESULTS             ', 'INFO');
  log('═══════════════════════════════════════════', 'INFO');
  console.log('\n');
  
  console.log(`📊 Total Requests:          ${stats.totalRequests}`);
  console.log(`✅ Successful:              ${stats.successfulRequests}`);
  console.log(`❌ Failed:                  ${stats.failedRequests}`);
  console.log(`📈 Success Rate:            ${finalStats.successRate}%`);
  console.log(`⏱️  Total Duration:          ${totalDuration}s`);
  console.log(`⚡ Avg Response Time:       ${finalStats.avgResponseTime}ms`);
  console.log(`🐌 Min Response Time:       ${finalStats.minResponseTime}ms`);
  console.log(`🚀 Max Response Time:       ${finalStats.maxResponseTime}ms`);
  console.log(`🔄 Requests per Second:     ${(stats.totalRequests / parseFloat(totalDuration)).toFixed(2)}`);
  
  if (stats.errors.length > 0) {
    console.log('\n');
    log('Errors encountered:', 'ERROR');
    stats.errors.slice(0, 10).forEach(err => {
      console.log(`  • ${err.endpoint}: ${err.error}`);
    });
    if (stats.errors.length > 10) {
      console.log(`  ... and ${stats.errors.length - 10} more errors`);
    }
  }
  
  console.log('\n');
  log('═══════════════════════════════════════════', 'INFO');
  
  // Performance assessment
  console.log('\n');
  const avgTime = parseFloat(finalStats.avgResponseTime);
  if (avgTime < 500) {
    log('🏆 EXCELLENT: Average response time under 500ms!', 'SUCCESS');
  } else if (avgTime < 1000) {
    log('👍 GOOD: Average response time under 1 second', 'SUCCESS');
  } else if (avgTime < 2000) {
    log('⚠️  ACCEPTABLE: Average response time under 2 seconds', 'WARNING');
  } else {
    log('❌ POOR: Average response time over 2 seconds', 'ERROR');
  }
  
  if (parseFloat(finalStats.successRate) >= 95) {
    log('🏆 EXCELLENT: Success rate above 95%!', 'SUCCESS');
  } else if (parseFloat(finalStats.successRate) >= 90) {
    log('👍 GOOD: Success rate above 90%', 'SUCCESS');
  } else {
    log('⚠️  NEEDS IMPROVEMENT: Success rate below 90%', 'WARNING');
  }
  
  console.log('\n');
}

// Run the test
runStressTest().catch(error => {
  log(`Fatal error: ${error.message}`, 'ERROR');
  process.exit(1);
});

