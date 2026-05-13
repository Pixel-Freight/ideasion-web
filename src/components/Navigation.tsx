import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { services } from "../data/siteContent";

const navItems = [
  ...services.map((service) => ({
    label: service.title,
    href: `/services/${service.slug}`,
  })),
  { label: "Contact Us", href: "/contact" },
];

interface NavigationProps {
  heroInView: boolean;
  isDesktop: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export default function Navigation({
  heroInView,
  isDesktop,
  onHoverStart,
  onHoverEnd,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const showFullList = isDesktop && isHome && heroInView;
  const showMenuButton = !showFullList;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavigate = (href: string) => {
    setIsOpen(false);

    if (href.startsWith("/#")) {
      navigate(href);
      return;
    }

    navigate(href);
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {showFullList ? (
          <motion.nav
            key="full-nav"
            className="fixed top-8 right-8 z-40 text-right"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.35 }}
          >
            <ul className="flex flex-col gap-5">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 + index * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                    className="nav-link text-sm font-normal tracking-wide text-text-secondary transition-colors duration-300 hover:text-text-primary"
                  >
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      {showMenuButton ? (
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          className="fixed top-8 right-8 z-50 flex h-12 w-12 items-center justify-center border border-border bg-bg-card text-text-primary backdrop-blur-md transition-colors duration-300 hover:border-border-hover"
        >
          <span className="flex flex-col gap-1.5">
            <span
              className={`block h-px w-5 bg-current transition-transform duration-300 ${isOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`block h-px w-5 bg-current transition-transform duration-300 ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      ) : null}

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              key="overlay"
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed top-0 right-0 z-50 grid h-full w-[min(24rem,88vw)] grid-rows-[auto_1fr_auto] border-l border-border bg-[#081014] px-6 py-6 sm:px-10 sm:py-10"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={onHoverStart}
                  onMouseLeave={onHoverEnd}
                  className="flex h-11 w-11 items-center justify-center border border-border text-text-primary transition-colors duration-300 hover:border-border-hover hover:text-text-secondary"
                >
                  <span className="relative block h-5 w-5" aria-hidden="true">
                    <span className="absolute left-1/2 top-1/2 block h-px w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                    <span className="absolute left-1/2 top-1/2 block h-px w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
                  </span>
                </button>
              </div>

              <nav className="flex flex-col justify-center gap-4 self-center justify-self-stretch py-10 sm:gap-5">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                    className="w-fit text-left font-display text-[clamp(2rem,8vw,3rem)] font-light leading-tight text-text-primary transition-colors duration-300 hover:text-text-secondary"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.18em] text-text-secondary">
                <a
                  href="mailto:hello@ideasion.id"
                  onMouseEnter={onHoverStart}
                  onMouseLeave={onHoverEnd}
                  className="w-fit text-text-primary transition-colors duration-300 hover:text-text-secondary"
                >
                  hello@ideasion.id
                </a>
                <span>@ideasion.id</span>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
