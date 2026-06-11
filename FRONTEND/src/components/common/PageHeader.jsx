import { motion } from "framer-motion";
import React from "react";

/**
 * PageHeader component
 * A reusable, premium header component with custom gradients, backdrop glows, icons, and badge support.
 *
 * @param {object} props
 * @param {string} props.title - The title text.
 * @param {string} [props.subtitle] - The subtitle/description text.
 * @param {React.ReactNode} [props.rightContent] - The right-side content (e.g. search bar).
 * @param {React.ElementType} [props.icon] - The Lucide icon component to display.
 * @param {'emerald' | 'green' | 'blue'} [props.theme] - The module-based theme ('emerald', 'green', or 'blue').
 * @param {React.ReactNode} [props.badges] - Additional tag badges or actions.
 */
export default function PageHeader({
  title,
  subtitle,
  rightContent,
  icon: Icon,
  theme = "emerald",
  badges,
}) {
  // Theme styling configurations
  const themeClasses = {
    emerald: "from-[#0B6E4F] via-[#0d7353] to-[#054E37] border-emerald-500/20 shadow-[0_24px_70px_rgba(11,110,79,0.15)]",
    green: "from-[#064E3B] via-[#0B6E4F] to-[#10B981] border-emerald-250/20 shadow-[0_24px_70px_rgba(6,78,59,0.2)]",
    blue: "from-[#0B6E4F] via-[#0D9488] to-[#0F766E] border-teal-500/20 shadow-[0_24px_70px_rgba(11,110,79,0.15)]",
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`relative mb-8 overflow-hidden rounded-[2rem] border bg-gradient-to-br p-6 text-white sm:p-8 ${themeClasses[theme] || themeClasses.emerald}`}
    >
      {/* Decorative backdrop glow */}
      {theme === "emerald" && (
        <>
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#129A72]/20 blur-3xl" />
        </>
      )}
      {theme === "green" && (
        <>
          <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-lime-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />
        </>
      )}
      {theme === "blue" && (
        <>
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-teal-400/25 blur-3xl" />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.1)_45%,transparent_65%)]" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          {/* Header Title with Icon */}
          <h1 className="mb-3 flex items-center gap-3 text-2xl font-black tracking-tight md:text-4xl">
            {Icon && (
              <motion.span
                whileHover={{ rotate: 12, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-md shrink-0"
              >
                <Icon className="h-6 w-6 text-lime-100" />
              </motion.span>
            )}
            <span>{title}</span>
          </h1>

          {/* Subtitle / Description */}
          {subtitle && (
            <p className="max-w-2xl text-sm leading-relaxed font-medium text-emerald-50/90 md:text-base">
              {subtitle}
            </p>
          )}

          {/* Optional Badges under description */}
          {badges && (
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-emerald-50">
              {badges}
            </div>
          )}
        </div>

        {/* Right side content (e.g. search input) */}
        {rightContent && (
          <div className="flex w-full sm:min-w-[320px] lg:justify-end">
            {rightContent}
          </div>
        )}
      </div>
    </motion.header>
  );
}
