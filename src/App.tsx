import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ProgramBuilder from './pages/ProgramBuilder'
import CustomerDatabase from './pages/CustomerDatabase'
import CampaignCenter from './pages/CampaignCenter'
import Analytics from './pages/Analytics'
import Billing from './pages/Billing'
import CustomerCard from './pages/CustomerCard'
import OnboardingWalkthrough from './pages/OnboardingWalkthrough'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/card/:merchantId" element={<CustomerCard />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingWalkthrough />
          </ProtectedRoute>
        } />
        <Route path="/programs" element={
          <ProtectedRoute>
            <ProgramBuilder />
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute>
            <CustomerDatabase />
          </ProtectedRoute>
        } />
        <Route path="/campaigns" element={
          <ProtectedRoute>
            <CampaignCenter />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App