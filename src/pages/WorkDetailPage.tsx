import { Link, Navigate, useParams } from 'react-router-dom'
import { getProjectBySlug, projects } from '../data/siteContent'

export default function WorkDetailPage() {
  const { projectSlug = '' } = useParams()
  const project = getProjectBySlug(projectSlug)

  if (!project) {
    return <Navigate to="/not-found" replace />
  }

  const currentIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <main
      className="min-h-screen pt-36 pb-24"
      style={{ background: 'linear-gradient(180deg, #05090B 0%, #081014 55%, #05090B 100%)' }}
    >
      <section className="section-gutter mb-16 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.18em] text-text-secondary">
            <span>{project.year}</span>
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <h1 className="font-display text-5xl font-light leading-[0.95] text-text-primary md:text-7xl">
            {project.title}
          </h1>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg lg:pt-10">
          {project.summary}
        </p>
      </section>

      <section className="section-gutter mb-16">
        <div className="aspect-[16/10] overflow-hidden">
          <img src={project.coverImage} alt={project.title} className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="section-gutter mb-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-text-secondary">
            Credits
          </span>
          <div className="flex flex-col gap-3 text-sm text-text-secondary">
            {project.credits.map((credit) => (
              <span key={credit}>{credit}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {project.gallery.map((image, index) => (
            <div key={`${image}-${index}`} className="aspect-[4/5] overflow-hidden">
              <img src={image} alt={`${project.title} view ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="section-gutter border-t border-border pt-12">
        <Link to={`/works/${nextProject.slug}`} className="group inline-flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-text-secondary">Next Project</span>
          <span className="font-display text-4xl font-light text-text-primary transition-colors duration-300 group-hover:text-text-secondary">
            {nextProject.title}
          </span>
        </Link>
      </section>
    </main>
  )
}
