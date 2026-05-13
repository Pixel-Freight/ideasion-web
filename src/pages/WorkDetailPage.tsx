import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjectBySlug, projects, type ProjectMedia } from '../data/siteContent'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function ProjectMediaBlock({ media, title, index }: { media: ProjectMedia; title: string; index: number }) {
  const label = media.alt ?? `${title} media ${index + 1}`

  if (media.type === 'video') {
    return (
      <motion.video
        className="h-full w-full object-cover"
        src={media.src}
        poster={media.poster}
        aria-label={label}
        muted
        loop
        playsInline
        autoPlay
      />
    )
  }

  return (
    <motion.img
      src={media.src}
      alt={label}
      className="h-full w-full object-cover"
      initial={{ scale: 1.04 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}

export default function WorkDetailPage() {
  const { projectSlug = '' } = useParams()
  const project = getProjectBySlug(projectSlug)

  if (!project) {
    return <Navigate to="/not-found" replace />
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <main className="work-detail-shell min-h-screen bg-bg-base text-text-primary">
      <aside className="work-detail-info">
        <motion.div
          className="work-detail-info-inner"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.07 }}
        >
          <div className="flex flex-col gap-6">
            <motion.div variants={reveal} className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-text-secondary">
              <span>{project.year}</span>
              {project.tags.map((tag) => (
                <span key={tag} className="border border-border px-3 py-2">
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.h1 variants={reveal} className="font-display text-[clamp(3.25rem,6vw,6.5rem)] font-light leading-[0.9] tracking-tight">
              {project.title}
            </motion.h1>

            <motion.p variants={reveal} className="text-sm leading-relaxed text-text-secondary md:text-base">
              {project.summary}
            </motion.p>
          </div>

          <motion.div variants={reveal} className="flex flex-col gap-8">
            <div>
              <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-text-secondary">
                Credits
              </span>
              <div className="flex flex-col gap-2 text-sm text-text-secondary">
                {project.credits.map((credit) => (
                  <span key={credit}>{credit}</span>
                ))}
              </div>
            </div>

            <Link to={`/works/${nextProject.slug}`} className="group flex w-fit flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-text-secondary">
                Next Project
              </span>
              <span className="font-display text-3xl font-light leading-none text-text-primary transition-colors duration-300 group-hover:text-text-secondary">
                {nextProject.title}
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </aside>

      <section className="work-detail-media-list" aria-label={`${project.title} project media`}>
        <motion.div
          className="work-detail-media work-detail-media-cover"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={project.coverImage}
            alt={`${project.title} cover`}
            className="h-full w-full object-cover"
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>

        {project.media.map((media, index) => (
          <motion.div
            key={`${media.src}-${index}`}
            className="work-detail-media"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectMediaBlock media={media} title={project.title} index={index} />
          </motion.div>
        ))}
      </section>
    </main>
  )
}
