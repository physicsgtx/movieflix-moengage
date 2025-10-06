import { Link } from 'react-router-dom'
import { Film, Search, BarChart3, Shield, Play, Info } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const { token } = useAuthStore()

  // Popular movie posters for the collage
  const moviePosters = [
    'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', // The Matrix
    'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg', // Titanic
    'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg', // The Lord of the Rings
    'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', // The Dark Knight
    'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', // Inception
    'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg', // Interstellar
    'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', // Pulp Fiction
    'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', // The Godfather
    'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', // The Shawshank Redemption
    'https://m.media-amazon.com/images/M/MV5BMTY4NzcwODg3Nl5BMl5BanBnXkFtZTcwNTEwOTMyMw@@._V1_SX300.jpg', // Avatar
    'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_SX300.jpg', // Avengers
    'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', // Star Wars
  ]

  return (
    <div className="min-h-screen">
      {/* Netflix-Style Hero Section with Collage */}
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Movie Collage Background */}
        <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 opacity-30 pointer-events-none">
          {moviePosters.map((poster, index) => (
            <div
              key={index}
              className="relative overflow-hidden group"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <img
                src={poster}
                alt={`Movie ${index + 1}`}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Movie'
                }}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>

        {/* Hero Content */}
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 sm:py-16">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-3xl pb-20 sm:pb-24">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full mb-6 animate-fadeIn text-sm sm:text-base shadow-lg">
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold">Unlimited Movies</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight animate-slideUp">
                Welcome to
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
                  MovieFlix
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl mb-4 text-gray-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Discover thousands of movies. Stream your favorites. Explore new worlds.
              </p>

              <p className="text-sm sm:text-base mb-8 text-gray-400 max-w-2xl animate-slideUp" style={{ animationDelay: '0.3s' }}>
                Advanced search with powerful filters, interactive analytics dashboard, and personalized recommendations.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                {token ? (
                  <>
                    <Link
                      to="/movies"
                      className="group flex items-center justify-center space-x-3 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-2xl"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Browse Movies</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="group flex items-center justify-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-all transform hover:scale-105"
                    >
                      <Info className="w-5 h-5" />
                      <span>View Dashboard</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group flex items-center justify-center space-x-3 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-2xl"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Get Started</span>
                    </Link>
                    <Link
                      to="/login"
                      className="group flex items-center justify-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-all transform hover:scale-105"
                    >
                      <Info className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 max-w-xl animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">1000+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Movies</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">50+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Genres</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-400">Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <Search className="w-16 h-16 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Advanced Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search movies with powerful filters including genre, year, rating, and more
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <BarChart3 className="w-16 h-16 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              View interactive charts and statistics about movies, genres, and ratings
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Secure & Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              JWT authentication with smart caching for lightning-fast performance
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!token && (
        <div className="bg-gray-100 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to explore movies?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join MovieFlix today and start discovering amazing films
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

