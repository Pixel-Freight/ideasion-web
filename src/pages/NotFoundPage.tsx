import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { services } from '../data/siteContent'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Selected Works', href: '/#projects' },
  { label: 'Contact', href: '/contact' },
]

export default function NotFoundPage() {
  return (
    <main className="not-found-page section-gutter min-h-screen bg-bg-base text-text-primary">
      <motion.div
        className="not-found-copy"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-text-secondary">404</span>
        <h1 className="font-display text-[clamp(4.5rem,14vw,13rem)] font-light leading-[0.82] tracking-tight">
          Page not found.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
          The page may have moved, or the direction is no longer available. Start from a service, selected works, or contact.
        </p>
      </motion.div>

      <motion.div
        className="not-found-links"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="grid gap-4">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className="nav-link w-fit font-display text-3xl font-light text-text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="grid gap-3 text-xs uppercase tracking-[0.18em] text-text-secondary">
          {services.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}`} className="transition-colors duration-300 hover:text-text-primary">
              {service.title}
            </Link>
          ))}
        </nav>
      </motion.div>
    </main>
  )
}
