import { useState, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

interface Project {
  id: number
  name: string
  category: string
  year: string
  image: string
}

const projects: Project[] = [
  { id: 1, name: 'Caca Jewel', category: 'Branding', year: '2025', image: '/projects/branding.png' },
  { id: 2, name: 'Marsee', category: 'Visual Identity', year: '2025', image: '/projects/identity.png' },
  { id: 3, name: 'Merci Cafe', category: 'Social Media', year: '2024', image: '/projects/social.png' },
  { id: 4, name: 'Hana Cafe', category: 'Branding & Social Media', year: '2024', image: '/projects/website.png' },
  { id: 5, name: 'Pulse', category: 'Website', year: '2024', image: '/projects/app.png' },
]

interface ProjectsSectionProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export default function ProjectsSection({ onHoverStart, onHoverEnd }: ProjectsSectionProps) {
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32"
      style={{
        background: 'linear-gradient(180deg, #05090B 0%, #080F13 50%, #05090B 100%)',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* ─── Section Header ─── */}
      <motion.div
        className="section-gutter mb-16 md:mb-20"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-text-secondary block mb-4">
          Selected Works
        </span>
        <h2 className="text-4xl md:text-5xl font-light font-display tracking-tight text-text-primary">
          Projects
        </h2>
      </motion.div>

      {/* ─── Project List ─── */}
      <div className="w-full">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="group relative border-t border-border last:border-b cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
            onMouseEnter={() => {
              setActiveProject(project.id)
              onHoverStart()
            }}
            onMouseLeave={() => {
              setActiveProject(null)
              onHoverEnd()
            }}
          >
            <div className="section-gutter flex min-h-[180px] flex-col items-start justify-center gap-5 py-12 transition-all duration-500 md:min-h-[230px] md:flex-row md:items-center md:justify-between md:py-20">
              {/* Project Name */}
              <h3
                className={`text-5xl md:text-7xl lg:text-8xl font-light font-display uppercase tracking-tight transition-all duration-500 ${
                  activeProject === project.id
                    ? 'text-text-primary'
                    : 'text-stroke'
                }`}
              >
                {project.name}
              </h3>

              {/* Meta info */}
              <div className="flex items-center gap-8 text-xs text-text-secondary md:gap-12 md:text-sm">
                <span className="tracking-wider uppercase opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                  {project.category}
                </span>
                <span className="tracking-wider opacity-70 transition-opacity duration-500 delay-75 group-hover:opacity-100">
                  {project.year}
                </span>
                <motion.span
                  className="hidden text-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:inline-block"
                  animate={activeProject === project.id ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </div>

            {/* Hover line accent */}
            <motion.div
              className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-text-secondary/40 to-transparent"
              initial={{ width: '0%' }}
              animate={activeProject === project.id ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        ))}
      </div>

      {/* ─── Floating Image Reveal ─── */}
      <motion.div
        className="project-image-reveal"
        style={{
          left: mousePos.x - 210,
          top: mousePos.y - 140,
        }}
        animate={{
          opacity: activeProject ? 1 : 0,
          scale: activeProject ? 1 : 0.85,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {activeProject && (
          <motion.img
            key={activeProject}
            src={projects.find(p => p.id === activeProject)?.image}
            alt=""
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.div>
    </section>
  )
}
