import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashEffect {
  id: string
  x: number
  y: number
}

export function SplashCursor() {
  const [splashes, setSplashes] = useState<SplashEffect[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't show splash on certain elements
      const target = e.target as HTMLElement
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) {
        return
      }

      const newSplash: SplashEffect = {
        id: Date.now().toString(),
        x: e.clientX,
        y: e.clientY,
      }

      setSplashes(prev => [...prev, newSplash])

      // Remove splash after animation completes
      setTimeout(() => {
        setSplashes(prev => prev.filter(splash => splash.id !== newSplash.id))
      }, 1000)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {splashes.map((splash) => (
          <motion.div
            key={splash.id}
            className="absolute"
            style={{
              left: splash.x - 25,
              top: splash.y - 25,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Primary expanding ring */}
            <motion.div
              className="absolute w-12 h-12 rounded-full border-2"
              style={{
                borderColor: 'oklch(0.75 0.15 25 / 0.8)', // accent color
                borderStyle: 'solid',
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            
            {/* Secondary ring with different timing */}
            <motion.div
              className="absolute w-12 h-12 rounded-full border-2"
              style={{
                borderColor: 'oklch(0.35 0.15 280 / 0.6)', // primary color
                borderStyle: 'dashed',
                borderDasharray: '4 4',
              }}
              initial={{ scale: 0, opacity: 1, rotate: 0 }}
              animate={{ scale: 2.5, opacity: 0, rotate: 180 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            />
            
            {/* Glowing center dot */}
            <motion.div
              className="absolute w-3 h-3 rounded-full left-[18px] top-[18px] shadow-lg"
              style={{
                backgroundColor: 'oklch(0.75 0.15 25)',
                boxShadow: '0 0 10px oklch(0.75 0.15 25 / 0.5)',
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            
            {/* Radiating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? 'oklch(0.75 0.15 25)' : 'oklch(0.35 0.15 280)',
                  left: 24 + Math.cos((i * Math.PI * 2) / 8) * 6,
                  top: 24 + Math.sin((i * Math.PI * 2) / 8) * 6,
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 35,
                  y: Math.sin((i * Math.PI * 2) / 8) * 35,
                  opacity: [1, 0.8, 0]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.15 + (i * 0.05),
                }}
              />
            ))}
            
            {/* Trailing sparkles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: 'oklch(0.85 0.08 290)',
                  left: 24 + Math.cos((i * Math.PI * 2) / 4 + Math.PI/4) * 8,
                  top: 24 + Math.sin((i * Math.PI * 2) / 4 + Math.PI/4) * 8,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 4 + Math.PI/4) * 20,
                  y: Math.sin((i * Math.PI * 2) / 4 + Math.PI/4) * 20,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.3 + (i * 0.1),
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}