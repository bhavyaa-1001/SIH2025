import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Layout
import Layout from './components/layout/Layout'

// Pages
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import About from './pages/About'
import ComplianceChecker from './components/ComplianceChecker'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/compliance" element={<ComplianceChecker />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
