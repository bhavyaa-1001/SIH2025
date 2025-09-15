import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Layout
import Layout from './components/layout/layout'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import About from './pages/About'
import Compliance from './pages/Compliance'
import WaterSavings from './pages/WaterSavings'
import SystemDesign from './pages/SystemDesign'
import Maintenance from './pages/Maintenance'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/assessment" element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              } />
              <Route path="/results/:id" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              <Route path="/compliance" element={
                <ProtectedRoute>
                  <Compliance />
                </ProtectedRoute>
              } />
              <Route path="/water-savings" element={
                <ProtectedRoute>
                  <WaterSavings />
                </ProtectedRoute>
              } />
              <Route path="/system-design" element={
                <ProtectedRoute>
                  <SystemDesign />
                </ProtectedRoute>
              } />
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <Maintenance />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
