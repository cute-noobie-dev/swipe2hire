import { ExternalLink, MapPin, Calendar, Building2 } from 'lucide-react'
import { formatSalary } from '../utils/formatSalary'
import { formatDate }   from '../utils/formatDate'

/**
 * JobCard — displays a single job's information.
 *
 * Props:
 *   job        {Object}   — job data object
 *   variant    {string}   — "swipe" (full card for deck) | "list" (compact for SavedJobs)
 *   onSave     {Function} — optional, called when Save action is clicked
 *   onRemove   {Function} — optional, called when Remove action is clicked
 *   isSaved    {boolean}  — whether the job is already in the saved list
 */
export default function JobCard({ job, variant = 'swipe', onSave, onRemove, isSaved }) {
  if (!job) return null

  const isSwipe = variant === 'swipe'

  return (
    <div
      className={`card flex flex-col gap-4 w-full
        ${isSwipe ? 'p-6 sm:p-8' : 'p-5'}
      `}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        {/* Company logo placeholder */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 border border-brand-border flex items-center justify-center">
          <Building2 size={20} className="text-blue-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-bold text-white truncate ${isSwipe ? 'text-2xl' : 'text-lg'}`}>
            {job.title}
          </h3>
          <p className="text-brand-muted text-sm mt-0.5">{job.company}</p>
        </div>

        <span className="source-badge flex-shrink-0">{job.source}</span>
      </div>

      {/* ── Meta row ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-brand-muted">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location}
        </span>
        <span className="text-brand-border">·</span>
        <span className="text-green-400 font-semibold">{formatSalary(job.salary)}</span>
        <span className="text-brand-border">·</span>
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {formatDate(job.postedDate)}
        </span>
      </div>

      {/* ── Tags ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {job.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        <span className="tag bg-brand-surface/60 text-brand-muted border-brand-border/60">
          {job.type}
        </span>
      </div>

      {/* ── Summary ─────────────────────────────────────── */}
      {isSwipe && (
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {job.summary}
        </p>
      )}

      {/* ── Actions ─────────────────────────────────────── */}
      <div className={`flex items-center gap-3 mt-auto pt-2 ${!isSwipe ? 'border-t border-brand-border' : ''}`}>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs px-4 py-2"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink size={14} />
          View Posting
        </a>

        {/* Swipe variant: show Save button */}
        {isSwipe && !isSaved && onSave && (
          <button onClick={onSave} className="btn-secondary text-xs px-4 py-2">
            Save Job
          </button>
        )}
        {isSwipe && isSaved && (
          <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
            ✓ Saved
          </span>
        )}

        {/* List variant: show Remove button */}
        {!isSwipe && onRemove && (
          <button
            onClick={() => onRemove(job.id)}
            className="btn-ghost text-xs ml-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
