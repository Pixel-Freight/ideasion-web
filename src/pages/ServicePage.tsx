import { useRef, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getProjectsBySlugs, getServiceBySlug, services } from '../data/siteContent'

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export default function ServicePage() {
  const { serviceSlug = '' } = useParams()
  const service = getServiceBySlug(serviceSlug)
  const horizontalStageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: horizontalStageRef,
    offset: ['start start', 'end end'],
  })
  const relatedProjects = service ? getProjectsBySlugs(service.projectSlugs) : []
  const panelCount = relatedProjects.length + 1
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(panelCount - 1) * 100}vw`])
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (!service) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <main className="min-h-screen bg-bg-base text-text-primary">
      <div
        ref={horizontalStageRef}
        className="service-page"
        style={{ '--service-panel-count': panelCount } as CSSProperties & Record<'--service-panel-count', number>}
      >
        <motion.div className="service-horizontal-scroll" style={{ x }}>
          <motion.div className="service-progress" style={{ scaleX: progressScale }} />
          <section className="service-panel service-intro-panel">
            <div className="service-panel-mask" />
            <motion.div
              className="service-intro-copy"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.45 }}
              transition={{ staggerChildren: 0.08 }}
            >
              <motion.span variants={reveal} className="text-xs uppercase tracking-[0.3em] text-text-secondary">
                Service
              </motion.span>
              <motion.h1 variants={reveal} className="font-display text-[clamp(4rem,12vw,11rem)] font-light leading-[0.86] tracking-tight">
                {service.title}
              </motion.h1>
              <motion.p variants={reveal} className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                {service.description}
              </motion.p>
              <motion.div variants={reveal} className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-text-secondary">
                {service.tags.map((tag) => (
                  <span key={tag} className="border border-border px-3 py-2 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </motion.div>
            <motion.div
              className="service-intro-media"
              aria-hidden="true"
              initial={{ opacity: 0.7, scale: 1.06 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={service.heroImage} alt="" />
            </motion.div>
          </section>

          {relatedProjects.map((project, index) => (
            <section key={project.slug} className="service-panel service-project-panel">
              <div className="service-panel-mask" />
              <motion.div
                className="service-project-media"
                initial={{ opacity: 0.65, scale: 1.04, x: -18 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ amount: 0.45 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={project.coverImage} alt={project.title} />
              </motion.div>
              <motion.div
                className="service-project-copy"
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.45 }}
                transition={{ staggerChildren: 0.07 }}
              >
                <motion.span variants={reveal} className="text-xs uppercase tracking-[0.3em] text-text-secondary">
                  {String(index + 1).padStart(2, '0')} / {String(relatedProjects.length).padStart(2, '0')}
                </motion.span>
                <motion.h2 variants={reveal} className="font-display text-[clamp(3.5rem,9vw,9rem)] font-light leading-[0.88] tracking-tight">
                  {project.title}
                </motion.h2>
                <motion.p variants={reveal} className="max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">
                  {project.summary}
                </motion.p>
                <motion.div variants={reveal} className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-text-secondary">
                  <span>{project.year}</span>
                  {project.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="border border-border px-3 py-2">
                      {tag}
                    </span>
                  ))}
                </motion.div>
                <motion.div variants={reveal}>
                  <Link
                    to={`/works/${project.slug}`}
                    className="nav-link w-fit text-sm uppercase tracking-[0.2em] text-text-primary transition-colors duration-300 hover:text-text-secondary"
                  >
                    View Project
                  </Link>
                </motion.div>
              </motion.div>
            </section>
          ))}
        </motion.div>
      </div>

      <section className="service-collaboration section-gutter">
        <motion.div
          className="service-collaboration-copy"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.span variants={reveal} className="text-xs uppercase tracking-[0.3em] text-text-secondary">
            Collaboration
          </motion.span>
          <motion.h2 variants={reveal} className="font-display text-[clamp(4rem,10vw,9rem)] font-light leading-[0.9] tracking-tight">
            Let's build the next {service.title.toLowerCase()} system.
          </motion.h2>
          <motion.p variants={reveal} className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Send the goal, timeline, and references. We will shape the direction, scope, and first concrete step from there.
          </motion.p>
          <motion.div variants={reveal} className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="border border-border px-5 py-3 text-sm uppercase tracking-[0.2em] text-text-primary transition-colors duration-300 hover:border-border-hover"
            >
              Contact Us
            </Link>
            <a
              href="mailto:hello@ideasion.id"
              className="border border-transparent px-5 py-3 text-sm uppercase tracking-[0.2em] text-text-secondary transition-colors duration-300 hover:text-text-primary"
            >
              hello@ideasion.id
            </a>
          </motion.div>
        </motion.div>

        <footer className="service-footer">
          <nav className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-text-secondary">
            {services.map((item) => (
              <Link key={item.slug} to={`/services/${item.slug}`} className="transition-colors duration-300 hover:text-text-primary">
                {item.title}
              </Link>
            ))}
          </nav>
          <a
            href="https://freightpx.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase tracking-[0.18em] text-text-secondary transition-colors duration-300 hover:text-text-primary"
          >
            In Collaboration with freightpx.com
          </a>
        </footer>
      </section>
    </main>
  )
}
