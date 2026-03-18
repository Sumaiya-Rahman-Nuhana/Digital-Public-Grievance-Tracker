import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GT</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">GrievanceTracker</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/feed" className={`text-sm font-medium transition-colors ${isActive('/feed') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
              Public Feed
            </Link>
            <Link to="/track" className={`text-sm font-medium transition-colors ${isActive('/track') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
              Track Issue
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                  Dashboard
                </Link>
                <Link to="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Report Issue
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/feed" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Public Feed</Link>
            <Link to="/track" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Track Issue</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/submit" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Report Issue</Link>
                <button onClick={handleLogout} className="text-sm text-red-500 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-sm text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}