import api from './api'

class KeepAliveService {
  constructor() {
    this.intervalId = null
    this.isActive = false
    this.pingInterval = 10 * 60 * 1000 // 10 minutes in milliseconds
    this.retryCount = 0
    this.maxRetries = 3
  }

  /**
   * Start the keep-alive service
   * This will ping the backend every 10 minutes to prevent Render from spinning down
   */
  start() {
    if (this.isActive) {
      console.log('Keep-alive service is already running')
      return
    }

    console.log('Starting keep-alive service to prevent Render cold starts')
    this.isActive = true
    
    // Ping immediately
    this.ping()
    
    // Set up interval for regular pings
    this.intervalId = setInterval(() => {
      this.ping()
    }, this.pingInterval)
  }

  /**
   * Stop the keep-alive service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isActive = false
    this.retryCount = 0
    console.log('Keep-alive service stopped')
  }

  /**
   * Ping the backend health endpoint
   */
  async ping() {
    try {
      const response = await api.get('/api/health/ping')
      if (response.status === 200) {
        console.log('Keep-alive ping successful:', response.data)
        this.retryCount = 0 // Reset retry count on success
      }
    } catch (error) {
      console.warn('Keep-alive ping failed:', error.message)
      this.handlePingError(error)
    }
  }

  /**
   * Handle ping errors with retry logic
   */
  handlePingError(error) {
    this.retryCount++
    
    if (this.retryCount <= this.maxRetries) {
      console.log(`Retrying ping (${this.retryCount}/${this.maxRetries})`)
      // Retry after a short delay
      setTimeout(() => {
        this.ping()
      }, 5000) // 5 second delay
    } else {
      console.error('Keep-alive service: Max retries exceeded, stopping service')
      this.stop()
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      retryCount: this.retryCount,
      pingInterval: this.pingInterval
    }
  }

  /**
   * Update ping interval
   */
  setPingInterval(intervalMs) {
    this.pingInterval = intervalMs
    if (this.isActive) {
      this.stop()
      this.start()
    }
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService()

export default keepAliveService
