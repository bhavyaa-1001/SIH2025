import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './App.css'

// Layout
import Layout from './components/layout/layout'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Assessment = lazy(() => import('./pages/Assessment'))
const Results = lazy(() => import('./pages/Results'))
const About = lazy(() => import('./pages/About'))
const Compliance = lazy(() => import('./pages/Compliance'))
const WaterSavings = lazy(() => import('./pages/WaterSavings'))
const SystemDesign = lazy(() => import('./pages/SystemDesign'))
const Maintenance = lazy(() => import('./pages/Maintenance'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const RunoffReport = lazy(() => import('./pages/RunoffReport'))

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
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
                <Route path="/runoff-report" element={
                  <ProtectedRoute>
                    <RunoffReport />
                  </ProtectedRoute>
                } />
                <Route path="/runoff_report.html" element={<RunoffReport />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
