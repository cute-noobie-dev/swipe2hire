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
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -8, scale: 0.99 }}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
        delay,
        scale: { duration: 0.32 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
