import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const statusConfig = {
  pending: { color: '#C9A84C', bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.3)' },
  'in-progress': { color: '#0FA4AF', bg: 'rgba(15,164,175,0.12)', border: 'rgba(15,164,175,0.3)' },
  resolved: { color: '#4CAF88', bg: 'rgba(76,175,136,0.12)', border: 'rgba(76,175,136,0.3)' },
  rejected: { color: '#FF7A6B', bg: 'rgba(255,122,107,0.12)', border: 'rgba(255,122,107,0.3)' },
}
const priorityDot = { low: '#4CAF88', medium: '#C9A84C', high: '#FF7A6B' }

export default function Dashboard() {
  const { user } = useAuth()
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/grievances')
      .then(({ data }) => setGrievances(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Reports', value: grievances.length, color: '#0FA4AF' },
    { label: 'Pending', value: grievances.filter(g => g.status === 'pending').length, color: '#C9A84C' },
    { label: 'In Progress', value: grievances.filter(g => g.status === 'in-progress').length, color: '#0FA4AF' },
    { label: 'Resolved', value: grievances.filter(g => g.status === 'resolved').length, color: '#4CAF88' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>

      {/* Top bar */}
      <div style={{ background: '#003135', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#0FA4AF', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>My Dashboard</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Welcome, <em style={{ fontStyle: 'italic', color: '#0FA4AF' }}>{user?.name}</em>
            </h1>
          </div>
          <Link to="/submit"
            style={{ background: '#0FA4AF', color: '#003135', padding: '0.75rem 1.6rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", border: '2px solid #0FA4AF', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(15,164,175,0.3)' }}
            onMouseOver={e => { e.currentTarget.style.background = '#AFDDE5' }}
            onMouseOut={e => { e.currentTarget.style.background = '#0FA4AF' }}>
            + Report New Issue
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>

        {/* Stats — using DM Sans so numbers show as 1,2,3 not Roman */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', marginTop: '-1.5rem' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 4px 20px rgba(0,49,53,0.07)' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '3rem', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '0.4rem' }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Reports list */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 4px 20px rgba(0,49,53,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(15,164,175,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#024950' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: '500', color: '#AFDDE5' }}>Your Reports</h2>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#0FA4AF', background: 'rgba(15,164,175,0.15)', padding: '4px 14px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(15,164,175,0.3)' }}>
              {grievances.length} total
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#7A9A9C', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem' }}>
              Loading your reports...
            </div>
          ) : grievances.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', color: '#003135', marginBottom: '0.5rem', fontWeight: '500' }}>No reports yet</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#7A9A9C', marginBottom: '1.5rem' }}>Start by reporting your first civic issue</p>
              <Link to="/submit" style={{ color: '#F8F6F0', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: '700', background: '#003135', padding: '0.6rem 1.4rem', borderRadius: '8px', border: '2px solid #003135', transition: 'all 0.2s' }}>
                Report an Issue →
              </Link>
            </div>
          ) : (
            <div>
              {grievances.map((g, i) => {
                const s = statusConfig[g.status] || statusConfig.pending
                return (
                  <div key={g._id}
                    style={{ padding: '1.5rem 2rem', borderBottom: i < grievances.length - 1 ? '1px solid rgba(15,164,175,0.08)' : 'none', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(15,164,175,0.03)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: priorityDot[g.priority], flexShrink: 0 }}/>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: '700', color: '#003135', fontSize: '0.95rem' }}>{g.title}</span>
                          <span style={{ fontSize: '0.75rem', padding: '3px 12px', borderRadius: '100px', background: s.bg, color: s.color, border: `1.5px solid ${s.border}`, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', fontWeight: '700', textTransform: 'capitalize' }}>
                            {g.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                          {[`🏷 ${g.category}`, g.location?.address && `📍 ${g.location.address}`, `🗓 ${new Date(g.createdAt).toLocaleDateString()}`].filter(Boolean).map((item, j) => (
                            <span key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#7A9A9C' }}>{item}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#0FA4AF', background: 'rgba(15,164,175,0.08)', padding: '5px 12px', borderRadius: '7px', border: '1px solid rgba(15,164,175,0.2)', flexShrink: 0, fontWeight: '700' }}>
                        {g.trackingId}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}