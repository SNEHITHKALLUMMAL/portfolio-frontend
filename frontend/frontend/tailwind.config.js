/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        night: {
          950: '#070b14',
          900: '#0b111c',
          800: '#101a2c',
          700: '#17233c',
          600: '#1f2e4d',
          500: '#2c3f66',
        },
        muted: {
          DEFAULT: '#94a3b8',
          light: '#64748b',
        },
        accent: {
          violet: '#14b8a6',
          blue: '#6366f1',
          light: '#5eead4',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        // Light-mode surface palette (kept minimal, premium SaaS light)
        cloud: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
        // legacy alias kept so any un-migrated utility classes don't hard-break
        primary: {
          50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a',
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)',
        'accent-gradient-soft': 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(99,102,241,0.15) 100%)',
        'radial-fade': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(20,184,166,0.25), transparent)',
      },
      borderRadius: {
        'xl2': '18px',
        '2xl2': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.28)',
        'glass-hover': '0 16px 48px rgba(20,184,166,0.18)',
        'glow-violet': '0 0 0 1px rgba(20,184,166,0.4), 0 0 24px rgba(20,184,166,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'float': 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'gradient-text': 'gradientText 5s ease infinite',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'particle': 'particle 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-16px) translateX(10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.06)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientText: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-120px) translateX(20px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
