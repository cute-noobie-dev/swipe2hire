/**
 * SwipeDeck.jsx
 *
 * Renders a stack of job cards. The top card is draggable.
 * Swipe right  → save job  (green overlay)
 * Swipe left   → skip job  (red overlay)
 * Keyboard:
 *   ← / ArrowLeft  → skip
 *   → / ArrowRight → save
 *
 * Uses Framer Motion for smooth card transitions.
 */
import { useState, useEffect, useCallback, memo } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Heart, X, ChevronRight } from 'lucide-react'
import JobCard from './JobCard'
import EmptyState from './EmptyState'
import { useJobs } from '../store/JobContext'

// How far (px) the user must drag to trigger a swipe action
const SWIPE_THRESHOLD = 100
// Maximum drag distance before resistance kicks in
const MAX_DRAG_DISTANCE = 300

// ── Performance-optimized background card component ──────────────────────────
const BackgroundCard = memo(({ job, offset, isJobSaved }) => {
  if (!job) return null
  
  // Enhanced visual layering with better depth perception
  const scale = 1 - offset * 0.05  // Slightly more pronounced scaling
  const translateY = offset * 16    // Increased vertical offset for better depth
  const opacity = 1 - offset * 0.3  // More pronounced opacity fade
  const blur = offset * 1           // Subtle blur for depth of field effect
  
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        zIndex: 10 - offset,
        willChange: 'transform, opacity',
        filter: `blur(${blur}px)`,
      }}
      initial={{ scale: scale - 0.02, opacity: 0 }}
      animate={{ scale, opacity }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="h-full overflow-hidden rounded-2xl">
        <JobCard
          job={job}
          variant="swipe"
          isSaved={isJobSaved(job.id)}
        />
      </div>
    </motion.div>
  )
})

BackgroundCard.displayName = 'BackgroundCard'

function SwipeDeck({ jobs }) {
  const { saveJob, isJobSaved } = useJobs()

  // Index of the current top card
  const [currentIndex, setCurrentIndex] = useState(0)

  // Framer Motion values for the top card
  const x      = useMotionValue(0)
  const rotate = useTransform(x, [-MAX_DRAG_DISTANCE, 0, MAX_DRAG_DISTANCE], [-15, 0, 15])
  const opacity = useTransform(x, [-MAX_DRAG_DISTANCE, 0, MAX_DRAG_DISTANCE], [0.8, 1, 0.8])

  // Overlay opacities with smoother transitions
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD, MAX_DRAG_DISTANCE], [0, 0.8, 1])
  const skipOpacity = useTransform(x, [-MAX_DRAG_DISTANCE, -SWIPE_THRESHOLD, 0], [1, 0.8, 0])

  // Performance optimization: precompute values
  const currentJob = jobs[currentIndex]
  const totalJobs  = jobs.length
  const remaining  = totalJobs - currentIndex
  
  // Preload next cards for smooth stacking (performance optimization)
  const nextCards = [
    jobs[currentIndex + 1],
    jobs[currentIndex + 2]
  ].filter(Boolean)

  // ── Swipe handlers ──────────────────────────────────────────────────────────
  const handleSwipeRight = useCallback(async () => {
    if (!currentJob) return
    
    // Optimized animation with reduced duration and simpler easing
    await animate(x, 400, {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2
    })
    
    // Batch state updates to prevent race conditions
    saveJob(currentJob)
    x.set(0)
    setCurrentIndex(i => i + 1)
  }, [currentJob, saveJob, x])

  const handleSwipeLeft = useCallback(async () => {
    if (!currentJob) return
    
    // Optimized animation with reduced duration and simpler easing
    await animate(x, -400, {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2
    })
    
    // Batch state updates
    x.set(0)
    setCurrentIndex(i => i + 1)
  }, [currentJob, x])

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') handleSwipeRight()
      if (e.key === 'ArrowLeft')  handleSwipeLeft()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleSwipeRight, handleSwipeLeft])

  // ── Drag end handler ────────────────────────────────────────────────────────
  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info
    
    // Consider both distance and velocity for more responsive swiping
    const shouldSwipeRight = offset.x > SWIPE_THRESHOLD || (offset.x > 50 && velocity.x > 500)
    const shouldSwipeLeft = offset.x < -SWIPE_THRESHOLD || (offset.x < -50 && velocity.x < -500)
    
    if (shouldSwipeRight) {
      handleSwipeRight()
    } else if (shouldSwipeLeft) {
      handleSwipeLeft()
    } else {
      // Snap back to center with optimized animation
      animate(x, 0, {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.15
      })
    }
  }

  // ── Empty states ────────────────────────────────────────────────────────────
  if (totalJobs === 0) {
    return <EmptyState type="no-jobs" />
  }

  if (currentIndex >= totalJobs) {
    return <EmptyState type="deck-empty" onReset={() => setCurrentIndex(0)} />
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">

      {/* Progress indicator */}
      <div className="flex items-center gap-3 text-sm text-brand-muted w-full">
        <span className="font-semibold text-white">{remaining}</span> jobs left
        <div className="flex-1 h-1 bg-brand-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-violet rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / totalJobs) * 100}%` }}
          />
        </div>
        <span>{totalJobs} total</span>
      </div>

      {/* Card stack (show up to 3 stacked cards for depth effect) */}
      <div className="relative w-full" style={{ height: 520 }}>
        {/* Pre-populated background cards with full content */}
        {[2, 1].map((offset) => {
          const idx = currentIndex + offset
          const job = jobs[idx]
          if (!job || idx >= totalJobs) return null
          
          return (
            <BackgroundCard
              key={`${job.id}-${idx}`}
              job={job}
              offset={offset}
              isJobSaved={isJobSaved}
            />
          )
        })}

        {/* Active draggable card with enhanced animations */}
        <motion.div
          key={`active-${currentJob.id}-${currentIndex}`}
          className="absolute inset-0 swipe-card"
          style={{
            x,
            rotate,
            opacity,
            zIndex: 20,
            touchAction: 'pan-y pinch-zoom',
            willChange: 'transform, opacity'
          }}
          drag="x"
          dragConstraints={{ left: -MAX_DRAG_DISTANCE, right: MAX_DRAG_DISTANCE }}
          dragElastic={0.1}
          dragMomentum={false}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileDrag={{
            scale: 1.02,
            transition: { duration: 0.1 }
          }}
          onDragEnd={handleDragEnd}
        >
          {/* Like overlay */}
          <motion.div
            className="absolute inset-0 z-30 rounded-2xl flex items-center justify-center pointer-events-none"
            style={{ opacity: likeOpacity }}
          >
            <div className="absolute inset-0 rounded-2xl bg-green-500/20 border-2 border-green-400" />
            <span className="relative flex items-center gap-2 text-green-400 font-display font-bold text-3xl rotate-[-12deg]">
              <Heart size={32} fill="currentColor" /> SAVE
            </span>
          </motion.div>

          {/* Skip overlay */}
          <motion.div
            className="absolute inset-0 z-30 rounded-2xl flex items-center justify-center pointer-events-none"
            style={{ opacity: skipOpacity }}
          >
            <div className="absolute inset-0 rounded-2xl bg-red-500/20 border-2 border-red-400" />
            <span className="relative flex items-center gap-2 text-red-400 font-display font-bold text-3xl rotate-[12deg]">
              <X size={32} /> SKIP
            </span>
          </motion.div>

          <div className="h-full overflow-y-auto">
            <JobCard
              job={currentJob}
              variant="swipe"
              onSave={handleSwipeRight}
              isSaved={isJobSaved(currentJob.id)}
            />
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSwipeLeft}
          className="w-14 h-14 rounded-full border border-red-500/40 bg-red-500/10 text-red-400
                     flex items-center justify-center hover:bg-red-500/20 active:scale-90
                     transition-all duration-200"
          aria-label="Skip job"
        >
          <X size={22} />
        </button>

        <button
          onClick={() => setCurrentIndex(i => i + 1)}
          className="w-10 h-10 rounded-full border border-brand-border bg-brand-surface text-brand-muted
                     flex items-center justify-center hover:text-white active:scale-90
                     transition-all duration-200"
          aria-label="Next job"
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={handleSwipeRight}
          className="w-14 h-14 rounded-full border border-green-500/40 bg-green-500/10 text-green-400
                     flex items-center justify-center hover:bg-green-500/20 active:scale-90
                     transition-all duration-200"
          aria-label="Save job"
        >
          <Heart size={22} />
        </button>
      </div>

      <p className="text-xs text-brand-muted">
        Drag card · or use <kbd className="px-1 py-0.5 rounded bg-brand-surface border border-brand-border">←</kbd> <kbd className="px-1 py-0.5 rounded bg-brand-surface border border-brand-border">→</kbd> keys
      </p>
    </div>
  )
}

// Export memoized component for performance optimization
export default memo(SwipeDeck)
