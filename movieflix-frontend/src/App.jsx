import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import Dashboard from './pages/Dashboard'
import keepAliveService from './services/keepAliveService'

function App() {
  const { token } = useAuthStore()

  // Initialize keep-alive service on app start
  useEffect(() => {
    // Only start keep-alive in production (when deployed to Render)
    if (import.meta.env.PROD) {
      console.log('Starting keep-alive service for production deployment')
      keepAliveService.start()
    }

    // Cleanup on unmount
    return () => {
      if (import.meta.env.PROD) {
        keepAliveService.stop()
      }
    }
  }, [])

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <Toaster position="top-right" />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index.html" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies" element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id" element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">Page Not Found</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

