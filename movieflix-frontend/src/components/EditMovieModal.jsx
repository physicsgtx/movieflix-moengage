import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function EditMovieModal({ movie, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    plot: '',
    director: '',
    actors: '',
    genre: '',
    rated: '',
    runtime: '',
    language: '',
    country: '',
    awards: '',
    poster: '',
    imdbRating: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        year: movie.year || '',
        plot: movie.plot || '',
        director: movie.director || '',
        actors: Array.isArray(movie.actors) ? movie.actors.join(', ') : '',
        genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : '',
        rated: movie.rated || '',
        runtime: movie.runtime || '',
        language: movie.language || '',
        country: movie.country || '',
        awards: movie.awards || '',
        poster: movie.poster || '',
        imdbRating: movie.imdbRating || '',
      })
    }
  }, [movie])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert comma-separated strings to arrays
      const updateData = {
        ...formData,
        year: parseInt(formData.year),
        runtime: formData.runtime ? parseInt(formData.runtime) : null,
        imdbRating: formData.imdbRating ? parseFloat(formData.imdbRating) : null,
        actors: formData.actors
          ? formData.actors.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
        genre: formData.genre
          ? formData.genre.split(',').map((g) => g.trim()).filter(Boolean)
          : [],
      }

      await adminAPI.updateMovie(movie.imdbId, updateData)
      toast.success('Movie updated successfully!')
      onUpdate()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update movie')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Movie
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Year *
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* IMDb Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                IMDb Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.imdbRating}
                onChange={(e) => setFormData({ ...formData, imdbRating: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Runtime */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Runtime (minutes)
              </label>
              <input
                type="number"
                value={formData.runtime}
                onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Rated */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Rated
              </label>
              <input
                type="text"
                value={formData.rated}
                onChange={(e) => setFormData({ ...formData, rated: e.target.value })}
                placeholder="e.g., PG-13, R, Not Rated"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Genre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Genres (comma-separated)
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                placeholder="e.g., Action, Sci-Fi, Thriller"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Plot */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Plot
              </label>
              <textarea
                value={formData.plot}
                onChange={(e) => setFormData({ ...formData, plot: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Director */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Director
              </label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Actors */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Actors (comma-separated)
              </label>
              <input
                type="text"
                value={formData.actors}
                onChange={(e) => setFormData({ ...formData, actors: e.target.value })}
                placeholder="e.g., Actor 1, Actor 2, Actor 3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Awards */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Awards
              </label>
              <input
                type="text"
                value={formData.awards}
                onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Poster URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Poster URL
              </label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="loader-sm"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

