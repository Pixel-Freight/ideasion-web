import { motion } from 'framer-motion'

const navItems = [
  { label: 'Branding', href: '#projects' },
  { label: 'Visual Identity', href: '#projects' },
  { label: 'Social Media Management', href: '#projects' },
  { label: 'Website', href: '#projects' },
  { label: 'Contact Us', href: '#contact' },
]

interface NavigationProps {
  onHoverStart: () => void
  onHoverEnd: () => void
}

export default function Navigation({ onHoverStart, onHoverEnd }: NavigationProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className="fixed top-8 right-8 z-40 text-right"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <ul className="flex flex-col gap-5">
        {navItems.map((item, i) => (
          <motion.li
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
          >
            <a
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              onMouseEnter={onHoverStart}
              onMouseLeave={onHoverEnd}
              className="nav-link text-sm font-normal tracking-wide text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              {item.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}
