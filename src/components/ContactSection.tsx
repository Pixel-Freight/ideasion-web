import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { services } from '../data/siteContent'

interface ContactSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

const footerLinks = services.map((service) => ({
  label: service.title,
  href: `/services/${service.slug}`,
}))

export default function ContactSection({ onHoverStart, onHoverEnd }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full scroll-mt-28 overflow-hidden border-t border-border"
      style={{
        background: 'linear-gradient(180deg, #05090B 0%, #081014 45%, #05090B 100%)',
      }}
    >
      <div className="section-gutter contact-shell grid min-h-[76vh] grid-cols-1 content-between gap-20 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          className="max-w-5xl cursor-pointer self-center"
        >
          <span className="mb-8 block text-xs uppercase tracking-[0.3em] text-text-secondary">
            Contact
          </span>
          <h2 className="font-display text-6xl font-light leading-[0.95] tracking-tight text-text-primary sm:text-7xl md:text-8xl lg:text-9xl">
            Let's
            <br />
            Discuss
          </h2>
        </motion.div>

        <motion.div
          className="flex max-w-xl flex-col justify-center gap-10 self-center lg:justify-self-end"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <p className="text-base leading-relaxed text-text-secondary md:text-lg">
            Have a project in mind? Send the brief, timeline, and goal. We will shape the next step from there.
          </p>

          <a
            href="mailto:hello@ideasion.id"
            className="inline-flex w-fit items-center gap-3 border-b border-text-primary pb-2 text-sm uppercase tracking-[0.2em] text-text-primary transition-colors duration-300 hover:text-text-secondary"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
          >
            hello@ideasion.id
            <span className="text-lg">-&gt;</span>
          </a>
        </motion.div>
      </div>

      <motion.footer
        className="section-gutter footer-shell grid gap-16 border-t border-border md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_auto_1fr]"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.55 }}
      >
        <div className="max-w-sm">
          <span className="mb-5 block font-display text-3xl font-light text-text-primary">
            Ideasion
          </span>
          <p className="text-sm leading-relaxed text-text-secondary">
            Design will only become a graphic if it cannot solved the problems.
          </p>
          <a
            href="https://freightpx.com"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex text-xs uppercase tracking-[0.18em] text-text-secondary transition-colors duration-300 hover:text-text-primary"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
          >
            In Collaboration with freightpx.com
          </a>
        </div>

        <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.18em] text-text-secondary md:justify-self-center">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="transition-colors duration-300 hover:text-text-primary"
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-5 text-sm text-text-secondary md:col-span-2 lg:col-span-1 lg:items-end">
          <a
            href="mailto:hello@ideasion.id"
            className="w-fit text-text-primary transition-colors duration-300 hover:text-text-secondary"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
          >
            hello@ideasion.id
          </a>
          <span className="text-xs uppercase tracking-[0.18em]">@ideasion.id</span>
          <span className="text-xs uppercase tracking-[0.18em]">2026</span>
        </div>
      </motion.footer>
    </section>
  )
}
