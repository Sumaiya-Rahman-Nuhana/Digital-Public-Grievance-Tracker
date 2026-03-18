import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Logo = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="10" fill="#003135"/>
    <circle cx="19" cy="19" r="7" fill="none" stroke="#0FA4AF" strokeWidth="1.5"/>
    <circle cx="19" cy="19" r="3" fill="#C9A84C"/>
    <path d="M19 8V12M19 26V30M8 19H12M26 19H30" stroke="#0FA4AF" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <path d="M12.5 12.5L15 15M23 23L25.5 25.5M25.5 12.5L23 15M15 23L12.5 25.5" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
  </svg>
)

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  const navLinkStyle = (path) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    fontWeight: isActive(path) ? '600' : '400',
    color: isActive(path) ? '#0FA4AF' : '#003135',
    textDecoration: 'none',
    letterSpacing: '0.03em',
    paddingBottom: '2px',
    borderBottom: isActive(path) ? '2px solid #0FA4AF' : '2px solid transparent',
    transition: 'all 0.2s',
  })

  return (
    <nav style={{ background: '#F8F6F0', borderBottom: '1px solid rgba(15,164,175,0.2)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 20px rgba(0,49,53,0.06)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', fontWeight: 600, color: '#003135', letterSpacing: '0.01em' }}>
            Grievance<span style={{ color: '#0FA4AF' }}>Tracker</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
          <Link to="/feed" style={navLinkStyle('/feed')}>Public Feed</Link>
          <Link to="/track" style={navLinkStyle('/track')}>Track Issue</Link>
          {user && <Link to="/dashboard" style={navLinkStyle('/dashboard')}>Dashboard</Link>}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/submit" style={{ background: '#003135', color: '#AFDDE5', padding: '0.6rem 1.4rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.03em', transition: 'all 0.2s', border: '2px solid #003135' }}
                onMouseOver={e => { e.currentTarget.style.background = '#0FA4AF'; e.currentTarget.style.borderColor = '#0FA4AF'; e.currentTarget.style.color = '#003135' }}
                onMouseOut={e => { e.currentTarget.style.background = '#003135'; e.currentTarget.style.borderColor = '#003135'; e.currentTarget.style.color = '#AFDDE5' }}>
                + Report Issue
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#0FA4AF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #AFDDE5' }}>
                  <span style={{ color: '#003135', fontWeight: '700', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <button onClick={handleLogout} style={{ fontSize: '0.85rem', color: '#7A9A9C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color = '#964734'}
                  onMouseOut={e => e.target.style.color = '#7A9A9C'}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/login" style={{ fontSize: '0.9rem', color: '#003135', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: '500' }}>Sign In</Link>
              <Link to="/register" style={{ background: '#003135', color: '#AFDDE5', padding: '0.6rem 1.4rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", border: '2px solid #003135', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#0FA4AF'; e.currentTarget.style.borderColor = '#0FA4AF'; e.currentTarget.style.color = '#003135' }}
                onMouseOut={e => { e.currentTarget.style.background = '#003135'; e.currentTarget.style.borderColor = '#003135'; e.currentTarget.style.color = '#AFDDE5' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ width: '22px', height: '2px', background: '#003135' }}/>
          <div style={{ width: '16px', height: '2px', background: '#0FA4AF' }}/>
          <div style={{ width: '22px', height: '2px', background: '#003135' }}/>
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: '#F8F6F0', borderTop: '1px solid rgba(15,164,175,0.15)', padding: '1rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[{ to: '/feed', label: 'Public Feed' }, { to: '/track', label: 'Track Issue' }, ...(user ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/submit', label: 'Report Issue' }] : [{ to: '/login', label: 'Sign In' }, { to: '/register', label: 'Get Started' }])].map(({ to, label }) => (
            <Link key={to} to={to} style={{ fontSize: '1rem', color: '#003135', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', padding: '0.5rem 0', borderBottom: '1px solid rgba(15,164,175,0.1)' }} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {user && <button onClick={handleLogout} style={{ fontSize: '1rem', color: '#964734', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', padding: '0.5rem 0' }}>Logout</button>}
        </div>
      )}
    </nav>
  )
}