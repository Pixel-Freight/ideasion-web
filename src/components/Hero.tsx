import { Suspense } from 'react'
import { motion } from 'framer-motion'
import GlassCube from './GlassCube'
import Navigation from './Navigation'

interface HeroProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export default function Hero({ onHoverStart, onHoverEnd }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0D1B22 0%, #080F13 40%, #05090B 100%)',
      }}
    >
      {/* ─── Bokeh Background Blobs ─── */}
      <div className="bokeh-blob" style={{ width: 600, height: 600, top: '10%', left: '20%', background: '#1a4a5e' }} />
      <div className="bokeh-blob" style={{ width: 400, height: 400, top: '50%', right: '10%', background: '#0e3040' }} />
      <div className="bokeh-blob" style={{ width: 300, height: 300, bottom: '5%', left: '5%', background: '#143a4a' }} />
      <div className="bokeh-blob" style={{ width: 200, height: 200, top: '20%', right: '30%', background: '#1e5a6a' }} />

      {/* ─── Logo (Small persistent) ─── */}
      <motion.a
        href="#hero"
        className="fixed top-8 left-8 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <img src="/logo.svg" alt="ideasion logo" className="h-8" />
      </motion.a>

      {/* ─── Navigation ─── */}
      <Navigation onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />

      {/* ─── Center: Large Background Logo ─── */}
      {/* ─── 3D Glass Cube ─── */}
      <Suspense fallback={null}>
        <GlassCube />
      </Suspense>

      {/* ─── Scroll indicator ─── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-text-secondary">Scroll</span>
        <motion.div
          className="w-px h-8 bg-text-secondary/30"
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
