import { Inbox, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * EmptyState
 *
 * Props:
 *   type     "no-jobs" | "deck-empty" | "no-saved"
 *   onReset  function — only used for "deck-empty"
 */
export default function EmptyState({ type, onReset }) {
  const configs = {
    'no-jobs': {
      icon: <Inbox size={40} className="text-brand-muted" />,
      title: 'No jobs found',
      body: 'Try adjusting your filters to see more results.',
      action: null,
    },
    'deck-empty': {
      icon: <span className="text-5xl">🎉</span>,
      title: "You've seen it all!",
      body: "You've swiped through every job in this set. Start over or adjust your filters.",
      action: (
        <button onClick={onReset} className="btn-primary">
          <RefreshCw size={16} />
          Start Over
        </button>
      ),
    },
    'no-saved': {
      icon: <span className="text-5xl">🔖</span>,
      title: 'No saved jobs yet',
      body: '"Swipe right on jobs you like and they'll appear here."',
      action: (
        <Link to="/discover" className="btn-primary">
          Start Swiping
        </Link>
      ),
    },
  }

  const { icon, title, body, action } = configs[type] ?? configs['no-jobs']

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-20 px-6">
      <div className="w-20 h-20 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-bold text-xl text-white">{title}</h3>
        <p className="text-brand-muted text-sm mt-2 max-w-xs">{body}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
