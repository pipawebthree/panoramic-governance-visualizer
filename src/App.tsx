import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import FlywheelPage from './pages/FlywheelPage'
import EpochSimulatorPage from './pages/EpochSimulatorPage'
import GlossaryPage from './pages/GlossaryPage'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<FlywheelPage />} />
        <Route path="/simulator" element={<EpochSimulatorPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  )
}

export default App

