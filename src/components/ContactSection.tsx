import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ContactSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

const footerLinks = [
  { label: 'Branding', href: '#projects' },
  { label: 'Visual Identity', href: '#projects' },
  { label: 'Social Media', href: '#projects' },
  { label: 'Website', href: '#projects' },
]

export default function ContactSection({ onHoverStart, onHoverEnd }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-t border-border"
      style={{
        background: 'linear-gradient(180deg, #05090B 0%, #081014 45%, #05090B 100%)',
      }}
    >
      <div className="grid min-h-[76vh] grid-cols-1 content-between gap-20 px-8 py-24 md:px-16 md:py-28 lg:grid-cols-[1.15fr_0.85fr]">
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
            <span className="text-lg">→</span>
          </a>
        </motion.div>
      </div>

      <motion.footer
        className="grid gap-10 border-t border-border px-8 py-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:px-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.55 }}
      >
        <a
          href="#hero"
          className="w-fit"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
        >
          <img src="/logo.svg" alt="ideasion logo" className="h-7" />
        </a>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-text-secondary">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-300 hover:text-text-primary"
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-text-secondary md:items-end">
          <span>@ideasion.id</span>
          <span>© 2026</span>
        </div>
      </motion.footer>
    </section>
  )
}
