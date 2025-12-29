/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abstract: {
          green: '#ABFE2C',
          blurple: '#7B61FF',
          void: '#050505',
          darkPurple: '#0F0B1E',
        },
        dark: {
          bg: '#050505',
          bgAlt: '#0F0B1E',
          surface: 'rgba(15, 11, 30, 0.6)',
          surfaceHover: 'rgba(15, 11, 30, 0.8)',
          border: 'rgba(171, 254, 44, 0.2)',
          borderGlow: 'rgba(171, 254, 44, 0.4)',
          text: '#e0e0e8',
          textMuted: '#a0a0b0',
          accent: '#ABFE2C',
          accentHover: '#8FE01C',
          blurple: '#7B61FF',
        },
      },
      fontFamily: {
        heading: ['VT323', 'monospace'],
        pixel: ['Press Start 2P', 'monospace'],
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(171, 254, 44, 0.3)',
        'glow-green-lg': '0 0 40px rgba(171, 254, 44, 0.5)',
        'glow-blurple': '0 0 20px rgba(123, 97, 255, 0.3)',
      },
    },
  },
  plugins: [],
}

