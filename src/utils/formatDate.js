/**
 * Returns a human-friendly relative date string.
 *
 * @param {string} dateStr  ISO date string, e.g. "2026-03-01"
 * @returns {string}        e.g. "2 days ago" | "Today" | "Mar 1"
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''

  const posted = new Date(dateStr)
  const now    = new Date()
  const diffMs = now - posted
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0)  return 'Today'
  if (diffDays === 1)  return 'Yesterday'
  if (diffDays < 7)   return `${diffDays} days ago`
  if (diffDays < 14)  return '1 week ago'
  if (diffDays < 30)  return `${Math.floor(diffDays / 7)} weeks ago`

  return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
