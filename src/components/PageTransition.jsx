import { motion } from 'framer-motion'

/**
 * PageTransition
 *
 * Smooth fade + lift enter, fade + compress exit.
 * Driven by <AnimatePresence mode="wait"> in App.jsx.
 *
 * Optional props:
 *   delay     {number}  — stagger delay for nested content (default 0)
 *   className {string}
 */
export default function PageTransition({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
        delay,
      }}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
