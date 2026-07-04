import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
