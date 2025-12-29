import { motion } from 'framer-motion'
import HeroSection from './components/sections/HeroSection'
import FlywheelSection from './components/sections/FlywheelSection'
import SimulatorSection from './components/sections/SimulatorSection'
import GlossarySection from './components/sections/GlossarySection'

function App() {
  return (
    <div className="relative w-full overflow-x-hidden bg-dark-bg">
      {/* Global Film Grain Overlay */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section with floating penguin */}
      <HeroSection />
      
      {/* Flywheel Section with animated SVG paths */}
      <FlywheelSection />
      
      {/* Simulator Section with glass morphism */}
      <SimulatorSection />
      
      {/* Glossary Section */}
      <GlossarySection />
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.6,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
        className="relative w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-dark-border"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-dark-textMuted text-sm">
            Built by{' '}
            <motion.a
              href="https://twitter.com/pipawebthree"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-textMuted hover:text-dark-accent transition-all duration-300 inline-block"
              whileHover={{ 
                scale: 1.05,
                color: '#ABFE2C',
                textShadow: '0 0 10px rgba(171, 254, 44, 0.5)',
              }}
            >
              <strong>@pipawebthree</strong>
            </motion.a>
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

export default App
