import { useState, useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import CustomCursor from './components/CustomCursor'

export default function App() {
  const [cursorHovering, setCursorHovering] = useState(false)

  // ─── Lenis smooth scrolling ───
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const handleHoverStart = () => setCursorHovering(true)
  const handleHoverEnd = () => setCursorHovering(false)

  return (
    <>
      <CustomCursor isHovering={cursorHovering} />

      <main className="relative">
        <Hero onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
        <ProjectsSection onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
        <ContactSection onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
      </main>
    </>
  )
}
