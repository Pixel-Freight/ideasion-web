import { useEffect, useState } from 'react'

function readMatch(query: string) {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}

export function useResponsiveSettings() {
  const [isDesktop, setIsDesktop] = useState(() => readMatch('(min-width: 1024px)'))
  const [isTabletUp, setIsTabletUp] = useState(() => readMatch('(min-width: 768px)'))
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => readMatch('(prefers-reduced-motion: reduce)'))

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const tabletQuery = window.matchMedia('(min-width: 768px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      setIsDesktop(desktopQuery.matches)
      setIsTabletUp(tabletQuery.matches)
      setPrefersReducedMotion(motionQuery.matches)
    }

    sync()
    desktopQuery.addEventListener('change', sync)
    tabletQuery.addEventListener('change', sync)
    motionQuery.addEventListener('change', sync)

    return () => {
      desktopQuery.removeEventListener('change', sync)
      tabletQuery.removeEventListener('change', sync)
      motionQuery.removeEventListener('change', sync)
    }
  }, [])

  return { isDesktop, isTabletUp, prefersReducedMotion }
}
