import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ProgramBuilder from './pages/ProgramBuilder'
import CustomerDatabase from './pages/CustomerDatabase'
import CampaignCenter from './pages/CampaignCenter'
import Analytics from './pages/Analytics'
import Billing from './pages/Billing'
import CustomerCard from './pages/CustomerCard'
import OnboardingWalkthrough from './pages/OnboardingWalkthrough'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading LoyaltyLink...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/card/:merchantId" element={<CustomerCard />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<OnboardingWalkthrough />} />
        <Route path="/programs" element={<ProgramBuilder />} />
        <Route path="/customers" element={<CustomerDatabase />} />
        <Route path="/campaigns" element={<CampaignCenter />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </Router>
  )
}

export default App