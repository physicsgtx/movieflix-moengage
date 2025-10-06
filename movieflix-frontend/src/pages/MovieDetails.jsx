import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Calendar, Clock, Globe, Award, Edit, Trash2 } from 'lucide-react'
import { movieAPI, adminAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import EditMovieModal from '../components/EditMovieModal'
import toast from 'react-hot-toast'

export default function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    fetchMovieDetails()
  }, [id])

  const fetchMovieDetails = async () => {
    try {
      const response = await movieAPI.getMovieById(id)
      setMovie(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch movie details')
      navigate('/movies')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await adminAPI.deleteMovie(id)
      toast.success('Movie deleted successfully!')
      navigate('/movies')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete movie')
      setIsDeleting(false)
    }
  }

  const handleUpdate = () => {
    fetchMovieDetails()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    )
  }

  if (!movie) return null

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button and Admin Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/movies')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Movies</span>
          </button>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
              >
                {isDeleting ? (
                  <>
                    <div className="loader-sm"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            {movie.poster && movie.poster !== 'N/A' ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No Poster</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {movie.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              {movie.imdbRating && (
                <div className="flex items-center space-x-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{movie.imdbRating}/10</span>
                </div>
              )}
              {movie.year && (
                <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {movie.rated && (
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                  {movie.rated}
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genre && movie.genre.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Plot */}
            {movie.plot && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Plot</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{movie.plot}</p>
              </div>
            )}

            {/* Credits */}
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              {movie.director && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Director</h3>
                  <p className="text-gray-700 dark:text-gray-300">{movie.director}</p>
                </div>
              )}
              {movie.actors && movie.actors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cast</h3>
                  <p className="text-gray-700 dark:text-gray-300">{movie.actors.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              {movie.language && (
                <div className="flex items-start space-x-2">
                  <Globe className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Language: </span>
                    <span className="text-gray-700 dark:text-gray-300">{movie.language}</span>
                  </div>
                </div>
              )}
              {movie.awards && (
                <div className="flex items-start space-x-2">
                  <Award className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Awards: </span>
                    <span className="text-gray-700 dark:text-gray-300">{movie.awards}</span>
                  </div>
                </div>
              )}
              {movie.country && (
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">Country: </span>
                  <span className="text-gray-700 dark:text-gray-300">{movie.country}</span>
                </div>
              )}
              {movie.imdbVotes && (
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">IMDb Votes: </span>
                  <span className="text-gray-700 dark:text-gray-300">{movie.imdbVotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Movie Modal */}
      <EditMovieModal
        movie={movie}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  )
}

