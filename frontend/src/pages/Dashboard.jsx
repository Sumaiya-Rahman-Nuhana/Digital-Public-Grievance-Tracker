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

const timelineIcons = {
  pending: '🕐',
  'in-progress': '⚙️',
  resolved: '✅',
  rejected: '❌',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/grievances')
      .then(({ data }) => setGrievances(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? grievances : grievances.filter(g => g.status === filter)

  const stats = [
    { label: 'Total Reports', value: grievances.length, color: '#0FA4AF' },
    { label: 'Pending', value: grievances.filter(g => g.status === 'pending').length, color: '#C9A84C' },
    { label: 'In Progress', value: grievances.filter(g => g.status === 'in-progress').length, color: '#0FA4AF' },
    { label: 'Resolved', value: grievances.filter(g => g.status === 'resolved').length, color: '#4CAF88' },
  ]

  const filters = ['all', 'pending', 'in-progress', 'resolved', 'rejected']

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
          <Link to="/submit" style={{ background: '#0FA4AF', color: '#003135', padding: '0.75rem 1.6rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", border: '2px solid #0FA4AF', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(15,164,175,0.3)' }}
            onMouseOver={e => e.currentTarget.style.background = '#AFDDE5'}
            onMouseOut={e => e.currentTarget.style.background = '#0FA4AF'}>
            + Report New Issue
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', marginTop: '-1.5rem' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 4px 20px rgba(0,49,53,0.07)', cursor: 'pointer' }}
              onClick={() => setFilter(s.label === 'Total Reports' ? 'all' : s.label.toLowerCase().replace(' ', '-'))}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '3rem', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '0.4rem' }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 18px', borderRadius: '8px', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: '600', textTransform: 'capitalize', transition: 'all 0.2s', background: filter === f ? '#003135' : 'white', color: filter === f ? '#0FA4AF' : '#7A9A9C', border: filter === f ? '1.5px solid rgba(15,164,175,0.3)' : '1.5px solid rgba(15,164,175,0.12)' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Reports list */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 4px 20px rgba(0,49,53,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(15,164,175,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#024950' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: '500', color: '#AFDDE5' }}>Your Reports</h2>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#0FA4AF', background: 'rgba(15,164,175,0.15)', padding: '4px 14px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(15,164,175,0.3)' }}>
              {filtered.length} shown
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#7A9A9C', fontFamily: "'DM Sans', sans-serif" }}>Loading your reports...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', color: '#003135', marginBottom: '0.5rem' }}>No reports found</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#7A9A9C' }}>
                {filter === 'all' ? 'Start by reporting your first civic issue' : `No ${filter} complaints`}
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((g, i) => {
                const s = statusConfig[g.status] || statusConfig.pending
                const isExpanded = expanded === g._id
                return (
                  <div key={g._id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(15,164,175,0.08)' : 'none' }}>
                    {/* Main row */}
                    <div style={{ padding: '1.5rem 2rem', transition: 'background 0.2s', cursor: 'pointer' }}
                      onClick={() => setExpanded(isExpanded ? null : g._id)}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(15,164,175,0.03)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                            <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: priorityDot[g.priority], flexShrink: 0 }} />
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: '700', color: '#003135', fontSize: '0.95rem' }}>{g.title}</span>
                            <span style={{ fontSize: '0.75rem', padding: '3px 12px', borderRadius: '100px', background: s.bg, color: s.color, border: `1.5px solid ${s.border}`, fontFamily: "'DM Sans', sans-serif", fontWeight: '700', textTransform: 'capitalize' }}>
                              {g.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                            {[`🏷️ ${g.category}`, g.location?.address && `📍 ${g.location.address}`, `🗓️ ${new Date(g.createdAt).toLocaleDateString()}`].filter(Boolean).map((item, j) => (
                              <span key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#7A9A9C' }}>{item}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#0FA4AF', background: 'rgba(15,164,175,0.08)', padding: '5px 12px', borderRadius: '7px', border: '1px solid rgba(15,164,175,0.2)', fontWeight: '700' }}>
                            {g.trackingId}
                          </div>
                          <span style={{ color: '#7A9A9C', fontSize: '0.8rem' }}>{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Feature 13: Timeline */}
                    {isExpanded && (
                      <div style={{ padding: '0 2rem 1.5rem 2rem', background: 'rgba(15,164,175,0.02)' }}>
                        <div style={{ borderTop: '1px dashed rgba(15,164,175,0.2)', paddingTop: '1.25rem' }}>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#0FA4AF', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '1rem' }}>Timeline</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {/* Submitted */}
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(15,164,175,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>📝</div>
                              <div>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: '700', color: '#003135' }}>Submitted</p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>{new Date(g.createdAt).toLocaleString()}</p>
                              </div>
                            </div>
                            {/* Updates */}
                            {g.updates && g.updates.map((u, idx) => (
                              <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(15,164,175,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>💬</div>
                                <div>
                                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: '700', color: '#003135' }}>{u.message}</p>
                                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>{new Date(u.date).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                            {/* Current status */}
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.bg, border: `1.5px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>{timelineIcons[g.status]}</div>
                              <div>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: '700', color: s.color, textTransform: 'capitalize' }}>Current: {g.status}</p>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>{new Date(g.updatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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