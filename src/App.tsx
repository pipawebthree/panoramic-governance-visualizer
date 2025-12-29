import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import FlywheelPage from './pages/FlywheelPage'
import EpochSimulatorPage from './pages/EpochSimulatorPage'
import GlossaryPage from './pages/GlossaryPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<FlywheelPage />} />
          <Route path="/simulator" element={<EpochSimulatorPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

