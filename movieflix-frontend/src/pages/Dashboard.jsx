import { useState, useEffect } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Film, Star, TrendingUp, Database } from 'lucide-react'
import { movieAPI } from '../services/api'
import toast from 'react-hot-toast'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await movieAPI.getStats()
      setStats(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    )
  }

  if (!stats) return null

  // Prepare data for charts
  const genreData = Object.entries(stats.genreDistribution || {}).map(([name, value]) => ({
    name,
    value
  }))

  const ratingData = Object.entries(stats.averageRatingByGenre || {}).map(([name, value]) => ({
    name,
    rating: value
  }))

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Movie statistics and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <Film className="w-6 h-6 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalMovies || 0}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Movies</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.overallAverageRating?.toFixed(1) || '0.0'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {Object.keys(stats.genreDistribution || {}).length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Genres</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Database className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {Object.keys(stats.averageRuntimeByYear || {}).length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Years Covered</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Genre Distribution */}
          {genreData.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Genre Distribution
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Movies by genre category
                  </p>
                </div>
                <div className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold">
                  {genreData.length} Genres
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Pie Chart */}
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {genreData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        formatter={(value) => [`${value} movies`, 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend with Stats */}
                <div className="w-full lg:w-1/2 space-y-2">
                  {genreData
                    .sort((a, b) => b.value - a.value)
                    .map((genre, index) => (
                      <div 
                        key={genre.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {genre.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {genre.value}
                          </span>
                          <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${(genre.value / Math.max(...genreData.map(g => g.value))) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {genreData.reduce((sum, g) => sum + g.value, 0)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Movies</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {genreData[0]?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Most Popular</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(genreData.reduce((sum, g) => sum + g.value, 0) / genreData.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Avg per Genre</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Average Rating by Genre */}
          {ratingData.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Average Rating by Genre
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    IMDb rating comparison across genres
                  </p>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>Ratings</span>
                </div>
              </div>

              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={ratingData.sort((a, b) => b.rating - a.rating)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <defs>
                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    stroke="currentColor"
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis 
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    stroke="currentColor"
                    className="text-gray-600 dark:text-gray-400"
                    label={{ 
                      value: 'Rating (out of 10)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      padding: '12px'
                    }}
                    labelStyle={{ 
                      color: 'white', 
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}
                    formatter={(value) => [
                      <span key="rating" className="flex items-center space-x-1">
                        <span>{value.toFixed(2)}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 inline" />
                      </span>, 
                      'Avg Rating'
                    ]}
                  />
                  <Bar 
                    dataKey="rating" 
                    fill="url(#ratingGradient)"
                    radius={[8, 8, 0, 0]}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {ratingData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Rating Legend */}
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Excellent</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">8.0+</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Good</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">6.0-7.9</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average</p>
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">4.0-5.9</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Poor</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">&lt;4.0</p>
                  </div>
                </div>
              </div>

              {/* Top Rated Genres */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Top Rated Genres
                </h3>
                <div className="space-y-2">
                  {ratingData
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((genre, index) => (
                      <div 
                        key={genre.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-red-50 dark:from-yellow-900/20 dark:to-red-900/20"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {genre.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {genre.rating.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* No Data Message */}
        {stats.totalMovies === 0 && (
          <div className="text-center py-20">
            <Database className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Data Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start searching for movies to see statistics
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

