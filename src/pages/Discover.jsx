import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import SwipeDeck from '../components/SwipeDeck'
import FilterPanel, { ActiveFilterChips } from '../components/FilterPanel'
import PageTransition from '../components/PageTransition'
import { getJobs } from '../services/jobService'
import { useJobs } from '../store/JobContext'

export default function Discover() {
  const { filters } = useJobs()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Stable string key derived from active filters —
  // passed as `key` to SwipeDeck so it fully remounts (resets
  // currentIndex) whenever the filtered job set changes.
  const deckKey = JSON.stringify(filters)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getJobs(filters)
      setJobs(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Refetch whenever filters change
  useEffect(() => { fetchJobs() }, [fetchJobs])

  return (
    <PageTransition>
    <div className="min-h-[calc(100vh-4rem)] bg-brand-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-brand-blue/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Discover</h1>
            <p className="text-brand-muted text-sm mt-1">
              {loading ? 'Loading jobs…' : error ? 'Error loading jobs' : `${jobs.length} jobs match your filters`}
            </p>
          </div>

          <FilterPanel onApply={fetchJobs} />
        </div>

        {/* Active filter chips — animated in/out */}
        <AnimatePresence>
          <div className="mb-6">
            <ActiveFilterChips onApply={fetchJobs} />
          </div>
        </AnimatePresence>

        {/* Swipe deck — keyed to filters so it fully resets on filter change */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchJobs} className="btn-primary px-6 py-2">Try Again</button>
          </div>
        ) : (
          <SwipeDeck key={deckKey} jobs={jobs} />
        )}
      </div>
    </div>
    </PageTransition>
  )
}
