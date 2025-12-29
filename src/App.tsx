import HeroSection from './components/sections/HeroSection'
import FlywheelSection from './components/sections/FlywheelSection'
import SimulatorSection from './components/sections/SimulatorSection'
import GlossarySection from './components/sections/GlossarySection'

function App() {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Hero Section with floating penguin */}
      <HeroSection />
      
      {/* Flywheel Section with scroll animations */}
      <FlywheelSection />
      
      {/* Simulator Section with glass morphism */}
      <SimulatorSection />
      
      {/* Glossary Section */}
      <GlossarySection />
      
      {/* Footer */}
      <footer className="relative w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-dark-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-dark-textMuted text-sm">
            Abstract Panoramix 🐧 — Panoramic Governance Visualizer
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
