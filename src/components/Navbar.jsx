import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Voting", path: "/voting" },
  { name: "Sign In", path: "/signin" },
]

export default function Navbar() {
  const location = useLocation()
  const [hoveredLink, setHoveredLink] = useState(null)
  const [pillStyles, setPillStyles] = useState({ width: 0, left: 0 })
  const [pillScale, setPillScale] = useState({ scaleX: 0.8, scaleY: 0.8 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRefs = useRef({})
  const mobileMenuRef = useRef()

  // Update pill position for active link
  useLayoutEffect(() => {
    const activeLink = navLinks.find(
      (link) =>
        location.pathname === link.path ||
        location.pathname.startsWith(link.path + "/")
    )
    if (activeLink) {
      const el = navRefs.current[activeLink.path]
      if (el) {
        const { offsetLeft, offsetWidth } = el
        setPillStyles({ width: offsetWidth, left: offsetLeft })
        setPillScale({ scaleX: 1, scaleY: 1 })
      }
    }
  }, [location.pathname])

  // Hover effect for desktop
  const handleMouseEnter = (path) => {
    const el = navRefs.current[path]
    if (el) {
      const { offsetLeft, offsetWidth } = el
      setPillScale({ scaleX: 0.9, scaleY: 0.9 })
      setPillStyles({ width: offsetWidth, left: offsetLeft })
      setTimeout(() => setPillScale({ scaleX: 1, scaleY: 1 }), 100)
    }
    setHoveredLink(path)
  }

  const handleMouseLeave = () => setHoveredLink(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center">
      <div className="hidden md:flex relative items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 shadow-[0_0_20px_rgba(236,72,153,0.2),inset_0_0_20px_rgba(168,85,247,0.15)] h-16">
        <ul className="flex gap-8 text-lg font-bold uppercase tracking-wide relative text-gray-200">
          {/* Floating Pill */}
          <motion.div
            layout
            animate={{
              width: pillStyles.width,
              x: pillStyles.left,
              scaleX: pillScale.scaleX,
              scaleY: pillScale.scaleY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1/2 -translate-y-1/2 h-10 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-md rounded-full border border-pink-400/40 z-0"
          />

          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              location.pathname.startsWith(link.path + "/")
            const isHovered = hoveredLink === link.path

            return (
              <li
                key={link.path}
                ref={(el) => (navRefs.current[link.path] = el)}
                className="relative z-10"
                onMouseEnter={() => handleMouseEnter(link.path)}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  animate={{ scale: isHovered || isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-5 py-2 rounded-full transition-colors duration-300 ${
                      isActive
                        ? "text-pink-400"
                        : "text-gray-200 hover:text-pink-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden w-full flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 bg-clip-text text-transparent"
        >
          ElectionApp
        </Link>
        <button
          className="text-gray-200 hover:text-pink-400 focus:outline-none"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-16 w-56 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.25)] p-4 flex flex-col gap-3 z-50"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-lg font-semibold transition-colors ${
                    location.pathname === link.path
                      ? "text-pink-400"
                      : "text-gray-200 hover:text-pink-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}