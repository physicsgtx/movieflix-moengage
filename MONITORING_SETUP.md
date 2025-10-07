# External Monitoring Services for Render Cold Start Prevention

This document provides configuration for various external monitoring services that can help prevent Render free tier instances from spinning down due to inactivity.

## 🔍 Available Monitoring Services

### 1. UptimeRobot (Recommended)
**Free Plan**: 50 monitors, 5-minute intervals
**Website**: https://uptimerobot.com

#### Setup Instructions:
1. Sign up for a free account at UptimeRobot
2. Add a new monitor with these settings:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: MovieFlix Backend Health
   - **URL**: `https://movieflix-moengage.onrender.com/api/health/ping`
   - **Monitoring Interval**: 5 minutes
   - **Monitor Timeout**: 30 seconds
   - **Keyword**: `pong` (optional)

3. Add another monitor for the frontend:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: MovieFlix Frontend
   - **URL**: `https://movieflix-moengage-frontend.onrender.com`
   - **Monitoring Interval**: 5 minutes

### 2. Pingdom
**Free Plan**: 1 monitor, 1-minute intervals
**Website**: https://pingdom.com

#### Setup Instructions:
1. Create a free Pingdom account
2. Add a new check:
   - **Check Type**: HTTP
   - **Name**: MovieFlix Backend
   - **URL**: `https://movieflix-moengage.onrender.com/api/health/ping`
   - **Check Interval**: 1 minute
   - **Expected Response**: `pong`

### 3. StatusCake
**Free Plan**: 10 monitors, 5-minute intervals
**Website**: https://statuscake.com

#### Setup Instructions:
1. Sign up for StatusCake
2. Create a new test:
   - **Website Name**: MovieFlix Backend
   - **Website URL**: `https://movieflix-moengage.onrender.com/api/health/ping`
   - **Check Rate**: 5 minutes
   - **Test Type**: HTTP

### 4. Freshping
**Free Plan**: 10 monitors, 1-minute intervals
**Website**: https://freshping.io

#### Setup Instructions:
1. Create a Freshping account
2. Add a new check:
   - **Check Name**: MovieFlix Backend Health
   - **URL**: `https://movieflix-moengage.onrender.com/api/health/ping`
   - **Check Interval**: 1 minute
   - **Expected Response**: `pong`

## 🚀 Quick Setup Script

You can use the provided `keep-alive.js` script as an alternative to external services:

```bash
# Install dependencies
npm install

# Run the keep-alive service
npm run keep-alive

# Or run directly
node keep-alive.js
```

## ⚙️ Environment Variables

Configure the keep-alive script with these environment variables:

```bash
# Required URLs
BACKEND_URL=https://movieflix-moengage.onrender.com
FRONTEND_URL=https://movieflix-moengage-frontend.onrender.com

# Optional settings
PING_INTERVAL=10  # minutes
MAX_RETRIES=3     # retry attempts
```

## 📊 Monitoring Endpoints

Your application now provides these monitoring endpoints:

### Backend Endpoints:
- `GET /api/health/ping` - Ultra-lightweight ping (returns "pong")
- `GET /api/health` - Basic health check with timestamp
- `GET /api/health/detailed` - Comprehensive health check with system info

### Frontend:
- `GET /` - Main application page

## 🔧 Advanced Configuration

### Custom Monitoring Script

Create a custom monitoring script for your specific needs:

```javascript
// custom-monitor.js
const https = require('https');

const endpoints = [
  'https://movieflix-moengage.onrender.com/api/health/ping',
  'https://movieflix-moengage-frontend.onrender.com'
];

async function pingEndpoint(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      resolve({ url, status: res.statusCode, success: res.statusCode < 400 });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Ping every 5 minutes
setInterval(async () => {
  console.log(`Pinging at ${new Date().toISOString()}`);
  for (const endpoint of endpoints) {
    try {
      const result = await pingEndpoint(endpoint);
      console.log(`✅ ${result.url}: ${result.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}, 5 * 60 * 1000);
```

## 📈 Best Practices

1. **Use Multiple Services**: Combine external monitoring with the built-in keep-alive service
2. **Monitor Both Frontend and Backend**: Ensure both services stay active
3. **Set Appropriate Intervals**: 5-10 minute intervals work well for Render free tier
4. **Monitor Response Times**: Track if cold starts are affecting performance
5. **Set Up Alerts**: Configure email/SMS alerts for downtime

## 🆘 Troubleshooting

### Common Issues:

1. **Service Not Responding**: Check if the instance has spun down
2. **Timeout Errors**: Increase timeout values in monitoring configuration
3. **False Positives**: Verify endpoint URLs are correct
4. **Rate Limiting**: Don't ping too frequently (avoid intervals < 1 minute)

### Debug Commands:

```bash
# Test backend health
curl https://movieflix-moengage.onrender.com/api/health/ping

# Test frontend
curl -I https://movieflix-moengage-frontend.onrender.com

# Check detailed health
curl https://movieflix-moengage.onrender.com/api/health/detailed
```

## 💡 Pro Tips

1. **Combine Strategies**: Use both external monitoring and the built-in keep-alive service
2. **Monitor During Peak Hours**: Ensure services are active when users are most likely to access them
3. **Set Up Logging**: Monitor logs to understand spin-down patterns
4. **Consider Upgrade**: For production applications, consider upgrading to Render's paid plans for better reliability

---

**Note**: These monitoring services help reduce cold starts but don't eliminate them completely. For production applications with high traffic, consider upgrading to Render's paid plans for better performance and reliability.
