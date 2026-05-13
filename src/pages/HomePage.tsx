import Hero from '../components/Hero'
import ProjectsSection from '../components/ProjectsSection'
import ContactSection from '../components/ContactSection'

interface HomePageProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export default function HomePage({ onHoverStart, onHoverEnd }: HomePageProps) {
  return (
    <>
      <Hero onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />
      <ProjectsSection onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />
      <ContactSection onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />
    </>
  )
}
