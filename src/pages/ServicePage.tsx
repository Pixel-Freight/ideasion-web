import { Link, Navigate, useParams } from 'react-router-dom'
import { getProjectsBySlugs, getServiceBySlug } from '../data/siteContent'

export default function ServicePage() {
  const { serviceSlug = '' } = useParams()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return <Navigate to="/not-found" replace />
  }

  const relatedProjects = getProjectsBySlugs(service.projectSlugs)

  return (
    <main
      className="min-h-screen pt-36 pb-24"
      style={{ background: 'linear-gradient(180deg, #05090B 0%, #081014 48%, #05090B 100%)' }}
    >
      <section className="section-gutter mb-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="mb-6 block text-xs uppercase tracking-[0.3em] text-text-secondary">
            Service
          </span>
          <h1 className="font-display text-5xl font-light leading-[0.95] text-text-primary md:text-7xl">
            {service.title}
          </h1>
        </div>
        <div className="flex flex-col gap-8 lg:pt-10">
          <p className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-text-secondary">
            {service.tags.map((tag) => (
              <span key={tag} className="border border-border px-3 py-2">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gutter grid gap-8 md:grid-cols-2">
        {relatedProjects.map((project) => (
          <Link
            key={project.slug}
            to={`/works/${project.slug}`}
            className="group block border border-border p-6 transition-colors duration-300 hover:border-border-hover"
          >
            <div className="mb-6 aspect-[4/3] overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="mb-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-text-secondary">
              <span>{project.year}</span>
              <span>{project.tags[0]}</span>
            </div>
            <h2 className="font-display text-3xl font-light text-text-primary md:text-4xl">
              {project.title}
            </h2>
          </Link>
        ))}
      </section>
    </main>
  )
}
