import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Star, Calendar, Edit, Download } from 'lucide-react'
import { movieAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import EditMovieModal from '../components/EditMovieModal'
import toast from 'react-hot-toast'

export default function Movies() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [allMovies, setAllMovies] = useState([])
  const [downloadingCSV, setDownloadingCSV] = useState(false)
  const [availableGenres, setAvailableGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
  })
  const [filters, setFilters] = useState({
    sort: 'rating',
    order: 'desc',
    minRating: '',
    page: 0,
    size: 12,
  })

  const isAdmin = user?.role === 'ADMIN'

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const params = {
        ...filters,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedGenres.length > 0 && { genres: selectedGenres }),
      }
      const response = await movieAPI.searchMovies(params)
      const data = response.data.data
      setMovies(data.movies)
      setPagination({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      })
      
      // Extract unique genres from all movies for the filter dropdown
      const allGenres = new Set()
      data.movies.forEach(movie => {
        if (movie.genre && Array.isArray(movie.genre)) {
          movie.genre.forEach(g => allGenres.add(g))
        }
      })
      setAvailableGenres([...allGenres].sort())
    } catch (error) {
      toast.error('Failed to fetch movies')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEdit = (movie, e) => {
    e.stopPropagation()
    setSelectedMovie(movie)
    setIsEditModalOpen(true)
  }

  const handleUpdate = () => {
    fetchMovies()
  }

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre)
      } else {
        return [...prev, genre]
      }
    })
  }

  const clearGenreFilters = () => {
    setSelectedGenres([])
  }

  const fetchAllMovies = async () => {
    try {
      const response = await movieAPI.searchMovies({
        page: 0,
        size: 10000, // Get all movies
        ...(searchQuery && { search: searchQuery }),
      })
      return response.data.data.movies
    } catch (error) {
      console.error('Failed to fetch all movies:', error)
      return []
    }
  }

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return ''

    // CSV Headers
    const headers = [
      'IMDb ID',
      'Title',
      'Year',
      'Rated',
      'Runtime (min)',
      'Genres',
      'Director',
      'Actors',
      'Plot',
      'Language',
      'Country',
      'Awards',
      'IMDb Rating',
      'IMDb Votes',
      'Type',
      'Poster URL',
    ]

    // CSV Rows
    const rows = data.map((movie) => [
      movie.imdbId || '',
      `"${(movie.title || '').replace(/"/g, '""')}"`, // Escape quotes
      movie.year || '',
      movie.rated || '',
      movie.runtime || '',
      `"${(movie.genre || []).join(', ')}"`,
      `"${(movie.director || '').replace(/"/g, '""')}"`,
      `"${(movie.actors || []).join(', ')}"`,
      `"${(movie.plot || '').replace(/"/g, '""')}"`,
      movie.language || '',
      movie.country || '',
      `"${(movie.awards || '').replace(/"/g, '""')}"`,
      movie.imdbRating || '',
      movie.imdbVotes || '',
      movie.type || '',
      movie.poster || '',
    ])

    // Combine headers and rows
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    return csv
  }

  const handleDownloadCSV = async () => {
    setDownloadingCSV(true)
    try {
      toast.loading('Preparing CSV download...', { id: 'csv-download' })
      
      // Fetch all movies
      const allMoviesData = await fetchAllMovies()
      
      if (allMoviesData.length === 0) {
        toast.error('No movies to download', { id: 'csv-download' })
        return
      }

      // Convert to CSV
      const csv = convertToCSV(allMoviesData)

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `movieflix_movies_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Downloaded ${allMoviesData.length} movies!`, { id: 'csv-download' })
    } catch (error) {
      console.error('CSV download error:', error)
      toast.error('Failed to download CSV', { id: 'csv-download' })
    } finally {
      setDownloadingCSV(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, filters, selectedGenres])

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Discover Movies
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {pagination.totalElements > 0 
                ? `Browse ${pagination.totalElements} cached movies or search for new ones`
                : 'Search for movies to start building your collection'}
            </p>
          </div>
          
          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCSV}
            disabled={downloadingCSV || pagination.totalElements === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
          >
            {downloadingCSV ? (
              <>
                <div className="loader-sm"></div>
                <span>Preparing...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download CSV</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies by title (e.g., Matrix, Batman, Avengers) or leave empty to see all cached movies"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>💡 Quick searches:</span>
            {['Matrix', 'Batman', 'Avengers', 'Star Wars', 'Lord of the Rings'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
              >
                <option value="rating">Sort by Rating</option>
                <option value="year">Sort by Year</option>
                <option value="title">Sort by Title</option>
                <option value="runtime">Sort by Runtime</option>
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Order
              </label>
              <select
                value={filters.order}
                onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500 transition-all"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            {/* Rating Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Minimum Rating: {filters.minRating || 0}
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">0</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={filters.minRating || 0}
                  onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(filters.minRating || 0) * 10}%, #e5e7eb ${(filters.minRating || 0) * 10}%, #e5e7eb 100%)`
                  }}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">10</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Any Rating</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {filters.minRating ? `${filters.minRating}+ ⭐` : 'All Movies'}
                </span>
              </div>
            </div>
          </div>

          {/* Genre Filter - Multi-Select */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Filter by Genres {selectedGenres.length > 0 && `(${selectedGenres.length} selected)`}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableGenres.length > 0 ? (
                availableGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                      selectedGenres.includes(genre)
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                    {selectedGenres.includes(genre) && (
                      <span className="ml-1.5">✓</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No genres available. Search for movies to see genres.
                </p>
              )}
            </div>
            {selectedGenres.length > 0 && (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Selected:</span>
                  {selectedGenres.map((genre) => (
                    <span
                      key={genre}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <button
                  onClick={clearGenreFilters}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
                >
                  Clear Genres
                </button>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(filters.minRating > 0 || selectedGenres.length > 0) && (
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Filters: {filters.minRating > 0 && 'Rating'}{filters.minRating > 0 && selectedGenres.length > 0 && ', '}{selectedGenres.length > 0 && `${selectedGenres.length} Genre(s)`}
                </span>
                <button
                  onClick={() => {
                    setFilters({ ...filters, minRating: '' })
                    clearGenreFilters()
                  }}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loader"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {movies.map((movie) => (
              <div
                key={movie.imdbId}
                onClick={() => navigate(`/movie/${movie.imdbId}`)}
                className="movie-card"
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3]">
                  {movie.poster && movie.poster !== 'N/A' ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="movie-card-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                      <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Dark Overlay on Hover */}
                  <div className="movie-card-overlay"></div>
                  
                  {/* Admin Edit Button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleEdit(movie, e)}
                      className="absolute top-2 left-2 p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg transition-all transform hover:scale-110 z-20 opacity-0 group-hover:opacity-100"
                      title="Edit Movie"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  
                  {/* Rating Badge */}
                  {movie.imdbRating && (
                    <div className="movie-card-rating bg-yellow-400 text-black px-2 py-0.5 sm:py-1 rounded-md flex items-center space-x-1 font-bold text-xs sm:text-sm shadow-lg z-10">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      <span>{movie.imdbRating}</span>
                    </div>
                  )}
                  
                  {/* Info Overlay - Shows on Hover */}
                  <div className="movie-card-info">
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg text-white mb-2 line-clamp-2">
                      {movie.title}
                    </h3>
                    
                    {/* Genres - Only show 2 */}
                    {movie.genre && movie.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {movie.genre.slice(0, 2).map((genre, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-xs px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No movies found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching for a different movie
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && movies.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center space-y-4">
            {/* Page Info */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{pagination.currentPage * filters.size + 1}</span> to{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.min((pagination.currentPage + 1) * filters.size, pagination.totalElements)}
                </span>{' '}
                of <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalElements}</span> results
              </p>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  pagination.currentPage === 0
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    index === 0 ||
                    index === pagination.totalPages - 1 ||
                    (index >= pagination.currentPage - 1 && index <= pagination.currentPage + 1)

                  if (!showPage) {
                    // Show ellipsis
                    if (
                      index === pagination.currentPage - 2 ||
                      index === pagination.currentPage + 2
                    ) {
                      return (
                        <span
                          key={index}
                          className="px-3 py-2 text-gray-500 dark:text-gray-400"
                        >
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg font-semibold transition-all ${
                        pagination.currentPage === index
                          ? 'bg-red-600 text-white shadow-lg transform scale-110'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages - 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  pagination.currentPage === pagination.totalPages - 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Next
              </button>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Items per page:</span>
              <div className="flex space-x-2">
                {[12, 24, 36, 48].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFilters({ ...filters, size, page: 0 })}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                      filters.size === size
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Movie Modal */}
      <EditMovieModal
        movie={selectedMovie}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedMovie(null)
        }}
        onUpdate={handleUpdate}
      />
    </div>
  )
}

