import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main
      className="section-gutter flex min-h-screen flex-col items-start justify-center gap-8"
      style={{ background: 'linear-gradient(180deg, #05090B 0%, #081014 48%, #05090B 100%)' }}
    >
      <span className="text-xs uppercase tracking-[0.3em] text-text-secondary">Not Found</span>
      <h1 className="font-display text-5xl font-light text-text-primary md:text-7xl">
        This page does not exist.
      </h1>
      <Link to="/" className="text-sm uppercase tracking-[0.2em] text-text-secondary transition-colors duration-300 hover:text-text-primary">
        Back To Home
      </Link>
    </main>
  )
}
