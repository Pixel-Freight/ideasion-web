import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Branding', href: '/services/branding' },
  { label: 'Visual Identity', href: '/services/visual-identity' },
  { label: 'Social Media', href: '/services/social-media' },
  { label: 'Website', href: '/services/website' },
  { label: 'Contact Us', href: '/#contact' },
]

interface NavigationProps {
  heroInView: boolean
  isDesktop: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}

export default function Navigation({ heroInView, isDesktop, onHoverStart, onHoverEnd }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const showFullList = isDesktop && location.pathname === '/' && heroInView

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleNavigate = (href: string) => {
    setIsOpen(false)

    if (href.startsWith('/#')) {
      navigate(href)
      return
    }

    navigate(href)
  }

  return (
    <>
      <AnimatePresence initial={false}>
        {showFullList ? (
          <motion.nav
            key="full-nav"
            className="fixed top-8 right-8 z-40 text-right"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.35 }}
          >
            <ul className="flex flex-col gap-5">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 + index * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                    className="nav-link text-sm font-normal tracking-wide text-text-secondary transition-colors duration-300 hover:text-text-primary"
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      {!showFullList ? (
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          className="fixed top-8 right-8 z-50 flex h-12 w-12 items-center justify-center border border-border bg-bg-card text-text-primary backdrop-blur-md transition-colors duration-300 hover:border-border-hover"
        >
          <span className="flex flex-col gap-1.5">
            <span className={`block h-px w-5 bg-current transition-transform duration-300 ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block h-px w-5 bg-current transition-transform duration-300 ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </span>
        </button>
      ) : null}

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              key="overlay"
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed top-0 right-0 z-50 flex h-full w-[min(26rem,88vw)] flex-col justify-between border-l border-border bg-[#081014] p-10"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="font-display text-2xl font-light text-text-primary">
                  Ideasion
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors duration-300 hover:text-text-primary"
                >
                  Close
                </button>
              </div>

              <nav className="mt-16 flex flex-col gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                    className="w-fit text-left font-display text-4xl font-light text-text-primary transition-colors duration-300 hover:text-text-secondary"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="text-xs uppercase tracking-[0.18em] text-text-secondary">
                hello@ideasion.id
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
