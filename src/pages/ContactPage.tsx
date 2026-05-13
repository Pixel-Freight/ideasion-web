import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { services } from '../data/siteContent'

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const prompts = ['Project goal', 'Timeline', 'Reference links', 'Budget range']

export default function ContactPage() {
  return (
    <main className="contact-page section-gutter min-h-screen bg-bg-base text-text-primary">
      <motion.section
        className="contact-page-hero"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
      >
        <motion.span variants={reveal} className="text-xs uppercase tracking-[0.3em] text-text-secondary">
          Contact Us
        </motion.span>
        <motion.h1 variants={reveal} className="font-display text-[clamp(4.5rem,13vw,12rem)] font-light leading-[0.86] tracking-tight">
          Let's discuss the next move.
        </motion.h1>
        <motion.p variants={reveal} className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
          Send the brief, timeline, and goal. We will respond with a practical first step and the right shape of collaboration.
        </motion.p>
        <motion.a
          variants={reveal}
          href="mailto:hello@ideasion.id"
          className="w-fit border border-border px-5 py-3 text-sm uppercase tracking-[0.2em] text-text-primary transition-colors duration-300 hover:border-border-hover"
        >
          hello@ideasion.id
        </motion.a>
      </motion.section>

      <section className="contact-page-grid">
        <motion.div
          className="contact-page-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.07 }}
        >
          <motion.span variants={reveal} className="text-xs uppercase tracking-[0.3em] text-text-secondary">
            Include
          </motion.span>
          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <motion.div key={prompt} variants={reveal} className="border-b border-border pb-4 font-display text-3xl font-light text-text-primary">
                {prompt}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="contact-page-panel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.07 }}
        >
          <motion.span variants={reveal} className="text-xs uppercase tracking-[0.3em] text-text-secondary">
            Services
          </motion.span>
          <nav className="grid gap-4">
            {services.map((service) => (
              <motion.div key={service.slug} variants={reveal}>
                <Link
                  to={`/services/${service.slug}`}
                  className="nav-link font-display text-3xl font-light text-text-primary transition-colors duration-300 hover:text-text-secondary"
                >
                  {service.title}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      </section>

      <footer className="contact-page-footer">
        <span className="text-xs uppercase tracking-[0.18em] text-text-secondary">@ideasion.id</span>
        <a
          href="https://freightpx.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-[0.18em] text-text-secondary transition-colors duration-300 hover:text-text-primary"
        >
          In Collaboration with freightpx.com
        </a>
      </footer>
    </main>
  )
}
