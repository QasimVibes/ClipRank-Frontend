/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0B',
        surface: '#111113',
        card: '#18181B',
        border: '#27272A',
        muted: '#71717A',
        primary: '#FAFAFA',
        accent: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          light: '#8B5CF6',
          subtle: 'rgba(124, 58, 237, 0.15)',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        rank: {
          high: '#10B981',
          mid: '#F59E0B',
          low: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.6), 0 4px 10px rgba(0,0,0,0.4)',
        'accent-glow': '0 0 0 2px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.2)',
        'success-glow': '0 0 0 2px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.1)',
      },
      borderRadius: {
        phone: '24px',
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      aspectRatio: {
        'phone': '9 / 16',
      },
    },
  },
  plugins: [],
}
