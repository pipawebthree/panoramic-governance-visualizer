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
          purple: '#1E1B2E',
          dark: '#050505',
          purpleLight: '#2A2540',
          purpleBorder: '#3A3550',
        },
        dark: {
          bg: '#050505',
          surface: '#1E1B2E',
          surfaceHover: '#2A2540',
          border: '#3A3550',
          text: '#e0e0e8',
          textMuted: '#a0a0b0',
          accent: '#ABFE2C',
          accentHover: '#8FE01C',
        },
      },
      fontFamily: {
        heading: ['VT323', 'monospace'],
        pixel: ['Press Start 2P', 'monospace'],
      },
    },
  },
  plugins: [],
}

