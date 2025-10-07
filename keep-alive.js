#!/usr/bin/env node

/**
 * Render Keep-Alive Script
 * 
 * This script helps prevent Render free tier instances from spinning down
 * by periodically pinging your application endpoints.
 * 
 * Usage:
 *   node keep-alive.js
 *   npm run keep-alive
 * 
 * Environment Variables:
 *   BACKEND_URL - Your backend URL (default: https://movieflix-moengage.onrender.com)
 *   FRONTEND_URL - Your frontend URL (default: https://movieflix-moengage-frontend.onrender.com)
 *   PING_INTERVAL - Ping interval in minutes (default: 10)
 *   MAX_RETRIES - Maximum retry attempts (default: 3)
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  backendUrl: process.env.BACKEND_URL || 'https://movieflix-moengage.onrender.com',
  frontendUrl: process.env.FRONTEND_URL || 'https://movieflix-moengage-frontend.onrender.com',
  pingInterval: parseInt(process.env.PING_INTERVAL) || 10, // minutes
  maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
  timeout: 30000 // 30 seconds
};

// Endpoints to ping
const endpoints = [
  { url: `${config.backendUrl}/api/health/ping`, name: 'Backend Ping' },
  { url: `${config.backendUrl}/api/health`, name: 'Backend Health' },
  { url: config.frontendUrl, name: 'Frontend' }
];

class KeepAliveService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.stats = {
      totalPings: 0,
      successfulPings: 0,
      failedPings: 0,
      startTime: null
    };
  }

  start() {
    if (this.isRunning) {
      console.log('Keep-alive service is already running');
      return;
    }

    console.log('🚀 Starting Render Keep-Alive Service');
    console.log(`📡 Backend URL: ${config.backendUrl}`);
    console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
    console.log(`⏰ Ping Interval: ${config.pingInterval} minutes`);
    console.log(`🔄 Max Retries: ${config.maxRetries}`);
    console.log('─'.repeat(60));

    this.isRunning = true;
    this.stats.startTime = new Date();

    // Ping immediately
    this.pingAllEndpoints();

    // Set up interval
    const intervalMs = config.pingInterval * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.pingAllEndpoints();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('\n🛑 Keep-alive service stopped');
    this.printStats();
  }

  async pingAllEndpoints() {
    console.log(`\n⏰ ${new Date().toLocaleString()} - Pinging endpoints...`);
    
    for (const endpoint of endpoints) {
      await this.pingEndpoint(endpoint);
    }
    
    this.printStats();
  }

  async pingEndpoint(endpoint) {
    this.stats.totalPings++;
    
    try {
      const startTime = Date.now();
      const response = await this.makeRequest(endpoint.url);
      const duration = Date.now() - startTime;
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        this.stats.successfulPings++;
        console.log(`✅ ${endpoint.name}: ${response.statusCode} (${duration}ms)`);
      } else {
        this.stats.failedPings++;
        console.log(`❌ ${endpoint.name}: ${response.statusCode} (${duration}ms)`);
      }
    } catch (error) {
      this.stats.failedPings++;
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https:') ? https : http;
      const options = {
        timeout: config.timeout,
        headers: {
          'User-Agent': 'Render-KeepAlive/1.0'
        }
      };

      const req = client.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  printStats() {
    const uptime = this.stats.startTime ? 
      Math.floor((Date.now() - this.stats.startTime.getTime()) / 1000) : 0;
    
    console.log('\n📊 Statistics:');
    console.log(`   Total Pings: ${this.stats.totalPings}`);
    console.log(`   Successful: ${this.stats.successfulPings}`);
    console.log(`   Failed: ${this.stats.failedPings}`);
    console.log(`   Success Rate: ${this.stats.totalPings > 0 ? 
      ((this.stats.successfulPings / this.stats.totalPings) * 100).toFixed(1) : 0}%`);
    console.log(`   Uptime: ${Math.floor(uptime / 60)}m ${uptime % 60}s`);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  if (keepAlive) {
    keepAlive.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  if (keepAlive) {
    keepAlive.stop();
  }
  process.exit(0);
});

// Start the service
const keepAlive = new KeepAliveService();
keepAlive.start();

// Keep the process alive
console.log('\n💡 Press Ctrl+C to stop the service');
console.log('💡 The service will continue running in the background');
