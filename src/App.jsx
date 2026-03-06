import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { JobProvider } from './store/JobContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Discover from './pages/Discover'
import SavedJobs from './pages/SavedJobs'

/**
 * Thin progress bar that flashes on every route change.
 * Purely cosmetic — gives the app a polished, SPA feel.
 */
function RouteProgressBar({ routeKey }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 500)
    return () => clearTimeout(t)
  }, [routeKey])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 h-[2px] z-[100] bg-gradient-to-r from-brand-blue to-brand-violet"
          initial={{ width: '0%',   opacity: 1 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{    width: '100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  )
}

/**
 * AnimatedRoutes — must live inside BrowserRouter to use useLocation.
 * Keying <Routes> on pathname tells AnimatePresence when to run exit → enter.
 */
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <>
      <RouteProgressBar routeKey={location.pathname} />

      <Routes location={location}>
        <Route path="/"         element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/saved"    element={<SavedJobs />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <JobProvider>
      {/* Navbar hides itself on "/" — see Navbar.jsx */}
      <Navbar />
      <AnimatedRoutes />
    </JobProvider>
  )
}
