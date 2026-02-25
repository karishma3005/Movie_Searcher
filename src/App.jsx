import { useState, useEffect } from 'react'

const TRENDING_MOVIES = ['Avengers', 'Titanic', 'Avatar', 'Inception', 'The Dark Knight', 'Frozen', 'Toy Story', 'Joker']

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [trendingMovies, setTrendingMovies] = useState([])
  const [showTrending, setShowTrending] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    loadTrendingMovies()
  }, [])

  const loadTrendingMovies = async () => {
    setLoading(true)
    try {
      const randomMovie = TRENDING_MOVIES[Math.floor(Math.random() * TRENDING_MOVIES.length)]
      const response = await fetch(`https://www.omdbapi.com/?s=${randomMovie}&apikey=4a3b711b`)
      const data = await response.json()
      if (data.Response === 'True') {
        setTrendingMovies(data.Search.slice(0, 5))
      }
    } catch (err) {
      console.error('Failed to load trending')
    } finally {
      setLoading(false)
    }
  }

  const searchMovies = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setShowTrending(true)
      setMovies([])
      return
    }

    setLoading(true)
    setError('')
    setSelectedMovie(null)
    setShowTrending(false)

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=4a3b711b`)
      const data = await response.json()

      if (data.Response === 'True') {
        setMovies(data.Search)
      } else {
        setError(data.Error)
        setMovies([])
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const getMovieDetails = async (imdbID) => {
    setLoading(true)
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=4a3b711b`)
      const data = await response.json()
      if (data.Response === 'True') {
        setSelectedMovie(data)
      }
    } catch (err) {
      setError('Failed to load movie details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-center text-yellow-500">Movie Searcher</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <form onSubmit={searchMovies} className="mt-6 flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies..."
                className="w-full px-5 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-1.5 rounded-full transition-all duration-300 hover:scale-105"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 dark:text-red-400 py-8 text-lg animate-pulse">{error}</div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12 animate-fade-in">
            <p className="text-xl">Search for your favorite movies</p>
            <p className="mt-2">Get details including plot, cast, ratings and more</p>
          </div>
        )}

        {showTrending && !loading && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">🔥 Trending Now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {trendingMovies.map((movie, index) => (
                <div
                  key={movie.imdbID}
                  onClick={() => getMovieDetails(movie.imdbID)}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-110 hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {movie.Poster !== 'N/A' ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-72 object-cover"
                    />
                  ) : (
                    <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">No Poster</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{movie.Title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{movie.Year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.imdbID}
              onClick={() => getMovieDetails(movie.imdbID)}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-110 hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {movie.Poster !== 'N/A' ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-72 object-cover"
                />
              ) : (
                <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No Poster</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{movie.Title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{movie.Year}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 py-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Movie Searcher. Built with React & Tailwind CSS.</p>
        </div>
      </footer>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setSelectedMovie(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {selectedMovie.Poster !== 'N/A' && (
                <img
                  src={selectedMovie.Poster}
                  alt={selectedMovie.Title}
                  className="w-full h-64 object-cover"
                />
              )}
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 bg-gray-900/80 hover:bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold">{selectedMovie.Title}</h2>
                <span className="bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {selectedMovie.imdbRating !== 'N/A' ? `⭐ ${selectedMovie.imdbRating}` : 'N/A'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>{selectedMovie.Year}</span>
                <span>•</span>
                <span>{selectedMovie.Runtime}</span>
                <span>•</span>
                <span>{selectedMovie.Genre}</span>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-yellow-500 mb-2">Plot</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedMovie.Plot}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Director</h3>
                  <p className="text-gray-900 dark:text-white">{selectedMovie.Director}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Cast</h3>
                  <p className="text-gray-900 dark:text-white text-sm">{selectedMovie.Actors}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                {selectedMovie.imdbVotes !== 'N/A' && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">IMDb Votes:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{selectedMovie.imdbVotes}</span>
                  </div>
                )}
                {selectedMovie.BoxOffice !== 'N/A' && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Box Office:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{selectedMovie.BoxOffice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
