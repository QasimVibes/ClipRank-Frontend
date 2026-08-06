import { Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle — animated sun/moon icon button.
 * Pass `variant="compact"` for the mobile topbar (no label).
 */
export default function ThemeToggle({ variant = 'default' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        title={label}
        aria-label={label}
        id="theme-toggle-compact"
        className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm font-medium text-muted transition-all duration-200 hover:border-accent/30 hover:text-primary"
      >
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/70">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                animate={{ scale: 1,   rotate: 0,   opacity: 1 }}
                exit={{   scale: 0.5, rotate:  90,  opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                {isDark
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4 text-indigo-400" />
                }
              </motion.span>
            </AnimatePresence>
          </span>
          <span>Theme</span>
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/80">
          {isDark ? 'Light' : 'Dark'}
        </span>
      </button>
    );
  }

  // Default — pill toggle with label (sidebar)
  return (
    <button
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      id="theme-toggle"
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm font-medium
        transition-all duration-200 cursor-pointer
        ${isDark
          ? 'bg-surface border-border text-muted hover:text-primary hover:border-accent/30'
          : 'bg-card   border-border text-muted hover:text-primary hover:border-accent/30'
        }
      `}
    >
      {/* Animated icon */}
      <span className="relative w-4 h-4 flex-shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
            animate={{ scale: 1,   rotate: 0,   opacity: 1 }}
            exit={{   scale: 0.4, rotate:  90,  opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark
              ? <Sun  className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-indigo-400" />
            }
          </motion.span>
        </AnimatePresence>
      </span>

      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>

      {/* Pill indicator */}
      <span className={`
        ml-auto w-8 h-4 rounded-full border flex items-center transition-all duration-300 flex-shrink-0
        ${isDark ? 'bg-accent/20 border-accent/40 justify-end' : 'bg-card border-border justify-start'}
      `}>
        <span className={`
          w-3 h-3 rounded-full mx-0.5 transition-all duration-300
          ${isDark ? 'bg-accent' : 'bg-muted/50'}
        `} />
      </span>
    </button>
  );
}
