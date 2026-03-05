import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── Shape of saved state ────────────────────────────────────────────────────
// savedJobs: Job[]
// filters:   { locationType: string[], type: string[], tags: string[] }

const STORAGE_KEY_SAVED   = 'swipe2hire_saved'
const STORAGE_KEY_FILTERS = 'swipe2hire_filters'

const defaultFilters = {
  locationType: [],
  type: [],
  tags: [],
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SAVE_JOB': {
      if (state.savedJobs.find(j => j.id === action.payload.id)) return state
      return { ...state, savedJobs: [action.payload, ...state.savedJobs] }
    }
    case 'REMOVE_JOB': {
      return { ...state, savedJobs: state.savedJobs.filter(j => j.id !== action.payload) }
    }
    case 'CLEAR_JOBS': {
      return { ...state, savedJobs: [] }
    }
    case 'SET_FILTERS': {
      return { ...state, filters: { ...state.filters, ...action.payload } }
    }
    case 'RESET_FILTERS': {
      return { ...state, filters: defaultFilters }
    }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const JobContext = createContext(null)

export function JobProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    savedJobs: loadFromStorage(STORAGE_KEY_SAVED,   []),
    filters:   loadFromStorage(STORAGE_KEY_FILTERS, defaultFilters),
  })

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED,   JSON.stringify(state.savedJobs))
  }, [state.savedJobs])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(state.filters))
  }, [state.filters])

  // ── Action helpers ──────────────────────────────────────────────────────────
  const saveJob    = (job)   => dispatch({ type: 'SAVE_JOB',    payload: job })
  const removeJob  = (id)    => dispatch({ type: 'REMOVE_JOB',  payload: id  })
  const clearJobs  = ()      => dispatch({ type: 'CLEAR_JOBS' })
  const setFilters = (f)     => dispatch({ type: 'SET_FILTERS', payload: f   })
  const resetFilters = ()    => dispatch({ type: 'RESET_FILTERS' })
  const isJobSaved = (id)    => state.savedJobs.some(j => j.id === id)

  return (
    <JobContext.Provider value={{
      savedJobs: state.savedJobs,
      filters:   state.filters,
      saveJob,
      removeJob,
      clearJobs,
      setFilters,
      resetFilters,
      isJobSaved,
    }}>
      {children}
    </JobContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useJobs() {
  const ctx = useContext(JobContext)
  if (!ctx) throw new Error('useJobs must be used within <JobProvider>')
  return ctx
}
