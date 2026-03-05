import { Link, useLocation } from 'react-router-dom'
import { Bookmark, Compass, Zap } from 'lucide-react'
import { useJobs } from '../store/JobContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { savedJobs } = useJobs()

  // Hide navbar on the home / landing page
  if (pathname === '/') return null

  const navLink = (to, label, Icon) => {
    const active = pathname === to
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
          ${active
            ? 'bg-brand-blue/20 text-blue-400 border border-brand-blue/30'
            : 'text-brand-muted hover:text-white hover:bg-brand-surface'
          }`}
      >
        <Icon size={16} />
        {label}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Swipe2Hire
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLink('/discover', 'Discover', Compass)}
          <Link
            to="/saved"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${pathname === '/saved'
                ? 'bg-brand-blue/20 text-blue-400 border border-brand-blue/30'
                : 'text-brand-muted hover:text-white hover:bg-brand-surface'
              }`}
          >
            <Bookmark size={16} />
            Saved
            {savedJobs.length > 0 && (
              <span className="ml-0.5 w-5 h-5 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center">
                {savedJobs.length > 9 ? '9+' : savedJobs.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
