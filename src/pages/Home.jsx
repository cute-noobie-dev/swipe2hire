import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, Bookmark, Rocket, Star } from 'lucide-react'
import PageTransition from '../components/PageTransition'

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 24 },
  animate:   { opacity: 1, y: 0 },
  transition:{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

export default function Home() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-brand-bg overflow-hidden">

      {/* ── Ambient glow blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[40%] w-[600px] h-[600px] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-violet/10 blur-[100px]" />
      </div>

      {/* ── Subtle grid overlay ── */}
      <div className="pointer-events-none fixed inset-0 bg-hero-grid bg-grid opacity-60" />

      {/* ── Minimal top nav ── */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">Swipe2Hire</span>
        </div>
        <Link to="/discover" className="btn-ghost text-sm">
          Launch app <ArrowRight size={14} />
        </Link>
      </header>

      {/* ── Hero ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
        <motion.div {...fadeUp(0)}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-border
                           bg-brand-surface text-xs font-semibold text-brand-muted mb-8">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            Job search — modernised
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="font-display font-extrabold text-5xl sm:text-7xl text-white leading-[1.05] tracking-tight"
        >
          Swipe jobs.
          <br />
          <span className="bg-gradient-to-r from-brand-blue via-blue-400 to-brand-violet bg-clip-text text-transparent">
            Get hired faster.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-lg text-brand-muted max-w-xl mx-auto leading-relaxed"
        >
          Stop drowning in job boards. Swipe2Hire aggregates listings from LinkedIn, Indeed &amp; more
          and lets you blaze through them — Tinder-style.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/discover" className="btn-primary text-base px-8 py-4 shadow-glow">
            <Rocket size={18} />
            Start Swiping
          </Link>
          <Link to="/saved" className="btn-secondary text-base px-8 py-4">
            <Bookmark size={18} />
            View Saved Jobs
          </Link>
        </motion.div>

        {/* ── Feature strip ── */}
        <motion.div
          {...fadeUp(0.45)}
          className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left"
        >
          {[
            {
              icon: '⚡',
              title: 'Discover jobs faster',
              body: 'No more endless scrolling. One swipe = one decision. Stay in flow state.',
            },
            {
              icon: '🔖',
              title: 'Save interesting roles',
              body: "Right-swipe anything that catches your eye. It's saved instantly, no account needed.",
            },
            {
              icon: '🚀',
              title: 'Apply directly',
              body: 'Every card links straight to the original posting. No middleman, no friction.',
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="card p-6 space-y-3">
              <span className="text-3xl">{icon}</span>
              <h3 className="font-display font-bold text-white text-lg">{title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
    </PageTransition>
  )
}
