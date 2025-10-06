import { Link } from 'react-router-dom'
import { ChevronRight, Search, BarChart3, Shield } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'

export default function Home() {
  const { token } = useAuthStore()
  const [email, setEmail] = useState('')

  // Popular movie posters for the background
  const moviePosters = [
    'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_SX300.jpg',
    'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
  ]

  return (
    <div className="min-h-screen">
      {/* Netflix-Style Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image Collage */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-0 h-full opacity-40">
            {moviePosters.map((poster, index) => (
              <div key={index} className="relative">
                <img
                  src={poster}
                  alt={`Movie ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Movie'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dark Gradient Overlay - Stronger */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content - Netflix Style */}
        <div className="relative min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center pt-20 pb-32">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Unlimited movies, TV shows and more
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-white mb-4 sm:mb-6">
              Watch anywhere. Cancel anytime. Absolutely free.
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10">
              Ready to watch? Enter your email to create or restart your membership.
            </p>

            {/* Email CTA - Netflix Style */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-2xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-black/50 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white text-base sm:text-lg"
              />
              {token ? (
                <Link
                  to="/movies"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-lg sm:text-xl flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Browse Movies</span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-lg sm:text-xl flex items-center justify-center space-x-2 transition-colors whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              )}
            </div>

            {/* Already a member link */}
            {!token && (
              <div className="mt-6">
                <Link
                  to="/login"
                  className="text-white hover:underline text-sm sm:text-base"
                >
                  Already a member? Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section - Blended with dark background */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose MovieFlix?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-600/10 rounded-full">
                  <Search className="w-12 h-12 text-red-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Advanced Search
              </h3>
              <p className="text-gray-300">
                Search movies with powerful filters including genre, year, rating, and more
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-600/10 rounded-full">
                  <BarChart3 className="w-12 h-12 text-red-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Analytics Dashboard
              </h3>
              <p className="text-gray-300">
                View interactive charts and statistics about movies, genres, and ratings
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-600/10 rounded-full">
                  <Shield className="w-12 h-12 text-red-500" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Secure & Fast
              </h3>
              <p className="text-gray-300">
                JWT authentication with smart caching for lightning-fast performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Blended */}
      {!token && (
        <div className="bg-gradient-to-b from-black to-gray-900 py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Ready to explore movies?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join MovieFlix today and start discovering amazing films - absolutely free!
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-10 py-5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-2xl text-xl"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

