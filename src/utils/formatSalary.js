/**
 * Normalises a raw salary string into a short display label.
 * In V1 the data already has formatted strings, so this is
 * mostly a pass-through — extend it as needed for Phase 2.
 *
 * @param {string} salary  e.g. "$60k – $80k" or "$50–$80/hr"
 * @returns {string}
 */
export function formatSalary(salary) {
  if (!salary) return 'Salary not disclosed'
  return salary
}
