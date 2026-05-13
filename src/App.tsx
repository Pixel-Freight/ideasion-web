import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import { useResponsiveSettings } from './hooks/useResponsiveSettings'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import ServicePage from './pages/ServicePage'
import WorkDetailPage from './pages/WorkDetailPage'

export default function App() {
  const [cursorHovering, setCursorHovering] = useState(false)
  const [heroInView, setHeroInView] = useState(true)
  const { isDesktop } = useResponsiveSettings()
  const location = useLocation()

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

  useEffect(() => {
    const hero = document.querySelector('#hero')
    if (!hero) {
      setHeroInView(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -65% 0px' },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [location.pathname])

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [location.pathname, location.hash])

  const handleHoverStart = () => setCursorHovering(true)
  const handleHoverEnd = () => setCursorHovering(false)

  return (
    <>
      <CustomCursor isHovering={cursorHovering} />
      <Link
        to="/"
        className="fixed top-8 left-8 z-50"
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        <img src="/logo.svg" alt="ideasion logo" className="h-8" />
      </Link>
      <Navigation
        heroInView={heroInView}
        isDesktop={isDesktop}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      />

      <Routes>
        <Route
          path="/"
          element={<HomePage onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />}
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services/website" element={<Navigate to="/services/webapp-development" replace />} />
        <Route path="/services/:serviceSlug" element={<ServicePage />} />
        <Route path="/works/:projectSlug" element={<WorkDetailPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </>
  )
}
