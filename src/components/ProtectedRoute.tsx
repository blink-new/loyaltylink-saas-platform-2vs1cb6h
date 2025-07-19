import { useEffect, useState } from 'react'
import { blink } from '@/blink/client'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // If not loading and no user, redirect to auth
      if (!state.isLoading && !state.user) {
        blink.auth.login(window.location.pathname)
      }
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

  if (!user) {
    // This will trigger the redirect in the useEffect
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute