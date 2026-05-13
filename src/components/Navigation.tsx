import { useCallback, useEffect, useState } from "react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocationKey = `${location.pathname}${location.hash}`;
  const [openLocationKey, setOpenLocationKey] = useState<string | null>(null);
  const isOpen = openLocationKey === currentLocationKey;
  const isHome = location.pathname === "/";
  const showFullList = isDesktop && isHome && heroInView;
  const showMenuButton = !showFullList;

  const closeNavigation = useCallback(() => setOpenLocationKey(null), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNavigation();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeNavigation]);

  const handleNavigate = (href: string) => {
    closeNavigation();

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
          onClick={() => {
            setOpenLocationKey((current) => (current === currentLocationKey ? null : currentLocationKey));
          }}
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
              onClick={closeNavigation}
            />
            <motion.aside
              key="drawer"
              className="nav-drawer"
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="nav-drawer-top">
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={closeNavigation}
                  onMouseEnter={onHoverStart}
                  onMouseLeave={onHoverEnd}
                  className="nav-drawer-close"
                >
                  <span className="nav-drawer-close-icon" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </button>
              </div>

              <nav className="nav-drawer-links">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    onMouseEnter={onHoverStart}
                    onMouseLeave={onHoverEnd}
                    className="nav-drawer-link"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="nav-drawer-bottom">
                <a
                  href="mailto:hello@ideasion.id"
                  onMouseEnter={onHoverStart}
                  onMouseLeave={onHoverEnd}
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
