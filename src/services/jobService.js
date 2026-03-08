/**
 * jobService.js
 *
 * All data access goes through this module — UI never imports jobs.json directly.
 * In Phase 2 swap the import for a real fetch() call without touching any component.
 */

import jobsData from '../data/jobs.json'

/**
 * Fetch jobs, optionally filtered.
 *
 * @param {Object} filters
 * @param {string[]} filters.locationType  e.g. ["Remote", "Hybrid"]
 * @param {string[]} filters.type          e.g. ["Full-time", "Internship"]
 * @param {string[]} filters.tags          e.g. ["React", "Python"]
 * @param {string} filters.keyword         e.g. "React Developer"
 * @param {string} filters.location        e.g. "San Francisco"
 * @param {string} filters.datePosted      e.g. "Past week"
 * @returns {Promise<Job[]>}
 */
export async function getJobs(filters = {}) {
  // --- Phase 2: replace with ---
  // const res = await fetch(`/api/jobs?${new URLSearchParams(filters)}`)
  // return res.json()

  let results = [...jobsData]

  const { locationType, type, keyword, location, datePosted } = filters

  if (locationType && locationType.length > 0) {
    results = results.filter(j => locationType.includes(j.locationType))
  }

  if (type && type.length > 0) {
    results = results.filter(j => type.includes(j.type))
  }

  // Keyword filter: search in title, company, summary, and tags
  if (keyword && keyword.trim()) {
    const searchTerm = keyword.toLowerCase().trim()
    results = results.filter(j => {
      const titleMatch = j.title.toLowerCase().includes(searchTerm)
      const companyMatch = j.company.toLowerCase().includes(searchTerm)
      const summaryMatch = j.summary.toLowerCase().includes(searchTerm)
      const tagsMatch = j.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      return titleMatch || companyMatch || summaryMatch || tagsMatch
    })
  }

  // Location filter: search in location field (city, country, region)
  if (location && location.trim()) {
    const searchTerm = location.toLowerCase().trim()
    results = results.filter(j => 
      j.location.toLowerCase().includes(searchTerm)
    )
  }

  // Date Posted filter
  if (datePosted && datePosted !== 'Any time') {
    const now = new Date()
    let daysBack = 0

    switch (datePosted) {
      case 'Past 24 hours':
        daysBack = 1
        break
      case 'Past 3 days':
        daysBack = 3
        break
      case 'Past week':
        daysBack = 7
        break
      case 'Past month':
        daysBack = 30
        break
      default:
        daysBack = 0
    }

    if (daysBack > 0) {
      const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
      results = results.filter(j => {
        const postedDate = new Date(j.postedDate)
        return postedDate >= cutoffDate
      })
    }
  }

  return results
}

/**
 * Fetch a single job by id.
 * @param {string} id
 * @returns {Promise<Job|undefined>}
 */
export async function getJobById(id) {
  return jobsData.find(j => j.id === id)
}
