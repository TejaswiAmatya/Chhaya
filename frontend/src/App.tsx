import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { SOSButton } from './components/ui/SOSButton'
import { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/signup" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feed" element={<ProtectedRoute><div className="min-h-screen bg-pageBg" /></ProtectedRoute>} />
          <Route path="/sahara" element={<ProtectedRoute><div className="min-h-screen bg-pageBg" /></ProtectedRoute>} />
        </Routes>
        <SOSButton />
      </BrowserRouter>
    </AuthProvider>
  )
}
