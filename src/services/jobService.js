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
 * @returns {Promise<Job[]>}
 */
export async function getJobs(filters = {}) {
  // --- Phase 2: replace with ---
  // const res = await fetch(`/api/jobs?${new URLSearchParams(filters)}`)
  // return res.json()

  let results = [...jobsData]

  const { locationType, type, tags } = filters

  if (locationType && locationType.length > 0) {
    results = results.filter(j => locationType.includes(j.locationType))
  }

  if (type && type.length > 0) {
    results = results.filter(j => type.includes(j.type))
  }

  if (tags && tags.length > 0) {
    results = results.filter(j =>
      tags.some(tag => j.tags.includes(tag))
    )
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
