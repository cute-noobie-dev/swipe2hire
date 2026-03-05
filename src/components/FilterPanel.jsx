/**
 * FilterPanel.jsx
 *
 * Slide-in drawer for filtering jobs.
 * Active filters are stored in JobContext → consumed by jobService → re-keys SwipeDeck.
 *
 * Exports:
 *   default FilterPanel   — trigger button + drawer
 *   ActiveFilterChips     — inline strip of active-filter pills (used in Discover header)
 */
import { useState } from 'react'
import { X, SlidersHorizontal, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJobs } from '../store/JobContext'

const LOCATION_TYPES = ['Remote', 'Hybrid', 'Onsite']
const JOB_TYPES      = ['Full-time', 'Part-time', 'Internship']
const POPULAR_TAGS   = ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Java', 'MongoDB', 'Figma']

// ─── Main component ───────────────────────────────────────────────────────────
export default function FilterPanel({ onApply }) {
  const { filters, setFilters, resetFilters } = useJobs()
  const [open, setOpen] = useState(false)

  // Local draft while the panel is open — only committed on "Apply"
  const [draft, setDraft] = useState(filters)

  const toggleItem = (key, value) => {
    setDraft(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))
  }

  const openPanel  = () => { setDraft(filters); setOpen(true)  }
  const closePanel = () => setOpen(false)

  const handleApply = () => {
    setFilters(draft)
    onApply?.()
    closePanel()
  }

  const handleReset = () => {
    const empty = { locationType: [], type: [], tags: [] }
    setDraft(empty)
    resetFilters()
    onApply?.()
    closePanel()
  }

  const activeCount =
    filters.locationType.length + filters.type.length + filters.tags.length

  const draftCount =
    draft.locationType.length + draft.type.length + draft.tags.length

  return (
    <>
      {/* ── Trigger button ─────────────────────────────── */}
      <button onClick={openPanel} className="btn-secondary relative">
        <SlidersHorizontal size={16} />
        Filters
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{    scale: 0, opacity: 0 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                         bg-brand-blue text-white text-xs font-bold
                         flex items-center justify-center"
            >
              {activeCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Backdrop ───────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closePanel}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0       }}
            exit={{    x: '100%'  }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50
                       bg-brand-surface border-l border-brand-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <h2 className="font-display font-bold text-xl text-white">Filters</h2>
              <button onClick={closePanel} className="btn-ghost p-2">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              <FilterGroup
                label="Work Type"
                options={LOCATION_TYPES}
                selected={draft.locationType}
                onToggle={v => toggleItem('locationType', v)}
              />
              <FilterGroup
                label="Job Type"
                options={JOB_TYPES}
                selected={draft.type}
                onToggle={v => toggleItem('type', v)}
              />
              <FilterGroup
                label="Skills / Tags"
                options={POPULAR_TAGS}
                selected={draft.tags}
                onToggle={v => toggleItem('tags', v)}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-brand-border flex gap-3">
              <button onClick={handleReset} className="btn-ghost flex-1 justify-center">
                Reset
              </button>
              <button onClick={handleApply} className="btn-primary flex-1 justify-center">
                <Check size={15} />
                Apply{draftCount > 0 ? ` (${draftCount})` : ''}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Active filter chips strip ────────────────────────────────────────────────
/**
 * Renders dismissible pills for every active filter.
 * Drop into the Discover header to give instant visual feedback.
 */
export function ActiveFilterChips({ onApply }) {
  const { filters, setFilters } = useJobs()

  const all = [
    ...filters.locationType.map(v => ({ key: 'locationType', value: v })),
    ...filters.type.map(v         => ({ key: 'type',         value: v })),
    ...filters.tags.map(v         => ({ key: 'tags',         value: v })),
  ]

  if (all.length === 0) return null

  const remove = (key, value) => {
    const updated = {
      ...filters,
      [key]: filters[key].filter(v => v !== value),
    }
    setFilters(updated)
    onApply?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{    opacity: 0, height: 0 }}
      className="flex flex-wrap gap-2 overflow-hidden"
    >
      <AnimatePresence>
        {all.map(({ key, value }) => (
          <motion.button
            key={`${key}:${value}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1   }}
            exit={{    opacity: 0, scale: 0.8 }}
            onClick={() => remove(key, value)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                       bg-brand-blue/15 text-blue-400 text-xs font-semibold
                       border border-brand-blue/30
                       hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30
                       transition-colors duration-150"
          >
            {value}
            <X size={11} />
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Reusable filter option group ─────────────────────────────────────────────
function FilterGroup({ label, options, selected, onToggle }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150
                ${active
                  ? 'bg-brand-blue/20 text-blue-400 border-brand-blue/50'
                  : 'bg-brand-card text-brand-muted border-brand-border hover:text-white hover:border-brand-muted'
                }`}
            >
              {active && <Check size={11} className="inline mr-1 -mt-0.5" />}
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
