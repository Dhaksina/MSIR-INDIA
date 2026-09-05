/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050505',
          900: '#0A0A0A', // Matte Black
          850: '#121212',
          800: '#171717', // Graphite
          700: '#262626',
        },
        amber: {
          400: '#FFD54F', // Electric Gold
          500: '#FFC107', // Premium Amber
          600: '#FFA000',
        },
        cyber: {
          blue: '#00F0FF',
          cyan: '#0EA5E9',
          green: '#10B981',
          gold: '#FFD54F',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-space)', 'sans-serif'],
      },
      boxShadow: {
        'amber-glow': '0 0 25px rgba(255, 193, 7, 0.25)',
        'amber-glow-lg': '0 0 50px rgba(255, 193, 7, 0.4)',
        'cyan-glow': '0 0 25px rgba(0, 240, 255, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(255,193,7,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,193,7,0.05) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        }
      }
    },
  },
  plugins: [],
}
