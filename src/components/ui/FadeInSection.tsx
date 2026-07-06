import { motion } from 'framer-motion'
import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  fadeOffset?: number
  parallaxDepth?: number
}

export default function FadeInSection({
  children,
  delay = 0,
  fadeOffset = 28,
  parallaxDepth = 80
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-parallaxDepth, parallaxDepth])
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96])
  const parallaxRotate = useTransform(scrollYProgress, [0, 1], [-0.65, 0.65])

  return (
    <motion.div
      ref={ref}
      style={{ y: parallaxY, scale: parallaxScale, rotateZ: parallaxRotate }}
      className="relative will-change-transform"
    >
      <motion.div
        initial={{ opacity: 0, y: fadeOffset }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
