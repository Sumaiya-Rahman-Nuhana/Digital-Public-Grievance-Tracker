import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SubmitGrievance from './pages/SubmitGrievance'
import TrackGrievance from './pages/TrackGrievance'
import PublicFeed from './pages/PublicFeed'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<PublicFeed />} />
        <Route path="/track" element={<TrackGrievance />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/submit" element={<ProtectedRoute><SubmitGrievance /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App