import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import JobCard from '../components/JobCard'
import EmptyState from '../components/EmptyState'
import PageTransition from '../components/PageTransition'
import { useJobs } from '../store/JobContext'

export default function SavedJobs() {
  const { savedJobs, removeJob, clearJobs } = useJobs()

  return (
    <PageTransition>
    <div className="min-h-[calc(100vh-4rem)] bg-brand-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Saved Jobs</h1>
            <p className="text-brand-muted text-sm mt-1">
              {savedJobs.length} {savedJobs.length === 1 ? 'role' : 'roles'} saved
            </p>
          </div>

          {savedJobs.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all saved jobs?')) clearJobs()
              }}
              className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 size={15} />
              Clear All
            </button>
          )}
        </div>

        {/* List */}
        {savedJobs.length === 0 ? (
          <EmptyState type="no-saved" />
        ) : (
          <div className="space-y-4">
            {savedJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                variant="list"
                onRemove={removeJob}
              />
            ))}

            {/* Bottom CTA */}
            <div className="pt-6 text-center">
              <Link to="/discover" className="btn-secondary">
                Keep Swiping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  )
}
