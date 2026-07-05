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
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary accent kept for compatibility with existing utility classes
        primary: {
          50: '#fff7ec',
          100: '#ffedd3',
          200: '#ffd9a6',
          300: '#ffbe6e',
          400: '#ffb454',
          500: '#f79a2e',
          600: '#e07f16',
          700: '#b8620f',
          800: '#934e14',
          900: '#784214',
        },
        // Secondary "keyword" accent (soft syntax blue)
        keyword: {
          300: '#c3d4ff',
          400: '#9db8ff',
          500: '#7aa2f7',
          600: '#5a7fe0',
          700: '#4763b8',
        },
        // Tertiary "string" accent (mint), used sparingly
        stringc: {
          400: '#8fe9c4',
          500: '#7adab3',
          600: '#4fb894',
        },
        ink: {
          950: '#08090d',
          900: '#0d0f15',
          850: '#11141b',
          800: '#171a23',
          700: '#1f232e',
          600: '#2a2f3d',
          400: '#565c6e',
          300: '#7b8092',
          200: '#a6abb9',
          100: '#c9ccd6',
        },
        paper: {
          50: '#faf9f6',
          100: '#f2f0ea',
          200: '#e7e4db',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.6)',
          dark: 'rgba(17, 20, 27, 0.6)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'grid-light': 'linear-gradient(to right, rgba(20,21,26,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,21,26,0.05) 1px, transparent 1px)',
        'grid-dark': 'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '38px 38px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'blink': 'blink 1.05s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3.5s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'gradient-x': 'gradientX 6s ease infinite',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(28px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-18px) translateX(8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
