import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface CustomCursorProps {
  isHovering: boolean
}

export default function CustomCursor({ isHovering }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mouseX, mouseY])

  const size = isHovering ? 60 : 8

  return (
    <motion.div
      ref={cursorRef}
      className="cursor-dot hidden md:block"
      style={{
        x,
        y,
        width: size,
        height: size,
        translateX: '-50%',
        translateY: '-50%',
        background: isHovering ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
        border: isHovering ? '1px solid rgba(255,255,255,0.2)' : 'none',
        mixBlendMode: isHovering ? 'normal' : 'difference',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    />
  )
}
