import { useState } from 'react'
import api from '../api/axios'

const statusConfig = {
  pending: { color: '#C9A84C', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)' },
  'in-progress': { color: '#0FA4AF', bg: 'rgba(15,164,175,0.1)', border: 'rgba(15,164,175,0.3)' },
  resolved: { color: '#4CAF88', bg: 'rgba(76,175,136,0.1)', border: 'rgba(76,175,136,0.3)' },
  rejected: { color: '#FF7A6B', bg: 'rgba(255,122,107,0.1)', border: 'rgba(255,122,107,0.3)' },
}
const statusSteps = ['pending', 'in-progress', 'resolved']

export default function TrackGrievance() {
  const [trackingId, setTrackingId] = useState('')
  const [grievance, setGrievance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setGrievance(null)
    try { const { data } = await api.get(`/grievances/track/${trackingId}`); setGrievance(data) }
    catch { setError('No complaint found with this tracking ID. Please check and try again.') }
    finally { setLoading(false) }
  }

  const currentStep = grievance ? statusSteps.indexOf(grievance.status) : -1
  const sc = grievance ? (statusConfig[grievance.status] || statusConfig.pending) : null

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>
      <div style={{ background: '#003135', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#0FA4AF', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>Status Lookup</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em' }}>Track Your Issue</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.5)', marginTop: '0.5rem', fontWeight: '300' }}>Enter your tracking ID to see the current status</p>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem' }}>
        <form onSubmit={handleTrack} style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 4px 20px rgba(0,49,53,0.06)', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.75rem' }}>Tracking ID</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input type="text" value={trackingId} onChange={e => setTrackingId(e.target.value.toUpperCase())} required placeholder="GRV-XXXXXXXX"
              style={{ flex: 1, padding: '0.9rem 1.1rem', borderRadius: '9px', fontSize: '1rem', background: '#F8F6F0', border: '1.5px solid rgba(15,164,175,0.2)', color: '#003135', fontFamily: 'monospace', outline: 'none', letterSpacing: '0.06em', transition: 'all 0.2s', fontWeight: '600' }}
              onFocus={e => { e.target.style.borderColor = '#0FA4AF'; e.target.style.boxShadow = '0 0 0 3px rgba(15,164,175,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(15,164,175,0.2)'; e.target.style.boxShadow = 'none' }}/>
            <button type="submit" disabled={loading} style={{ background: '#003135', color: '#AFDDE5', padding: '0.9rem 1.75rem', borderRadius: '9px', fontSize: '0.95rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, border: '2px solid #003135', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(0,49,53,0.2)', flexShrink: 0 }}
              onMouseOver={e => !loading && (e.currentTarget.style.background = '#0FA4AF')}
              onMouseOut={e => !loading && (e.currentTarget.style.background = '#003135')}>
              {loading ? 'Searching...' : 'Track →'}
            </button>
          </div>
        </form>

        {error && <div style={{ background: 'rgba(150,71,52,0.1)', border: '1.5px solid rgba(150,71,52,0.3)', color: '#964734', padding: '1rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>{error}</div>}

        {grievance && sc && (
          <div className="afu" style={{ background: 'white', borderRadius: '16px', border: `1.5px solid ${sc.border}`, boxShadow: '0 6px 30px rgba(0,49,53,0.08)', overflow: 'hidden' }}>
            <div style={{ background: '#003135', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${sc.color}20 0%, transparent 70%)`, transform: 'translate(30%,-30%)', pointerEvents: 'none' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', fontWeight: '500', color: '#F8F6F0', marginBottom: '0.4rem' }}>{grievance.title}</h2>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgba(15,164,175,0.7)', letterSpacing: '0.06em', fontWeight: '600' }}>{grievance.trackingId}</p>
                </div>
                <span style={{ fontSize: '0.82rem', padding: '6px 16px', borderRadius: '100px', background: sc.bg, color: sc.color, border: `1.5px solid ${sc.border}`, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em', textTransform: 'capitalize', fontWeight: '700' }}>
                  {grievance.status}
                </span>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              {grievance.status !== 'rejected' && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', height: '2px', background: 'rgba(15,164,175,0.15)', zIndex: 0 }}/>
                    <div style={{ position: 'absolute', top: '16px', left: '16px', height: '2px', background: '#0FA4AF', zIndex: 1, transition: 'width 0.5s ease', width: currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : 'calc(100% - 32px)' }}/>
                    {statusSteps.map((step, i) => (
                      <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2 }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.3s', background: i <= currentStep ? '#0FA4AF' : 'white', color: i <= currentStep ? '#003135' : '#7A9A9C', border: i <= currentStep ? '2px solid #0FA4AF' : '2px solid rgba(15,164,175,0.2)' }}>
                          {i < currentStep ? '✓' : i + 1}
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: i <= currentStep ? '#0FA4AF' : '#7A9A9C', textTransform: 'capitalize', letterSpacing: '0.04em', fontWeight: i <= currentStep ? '700' : '400' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ height: '1px', background: 'rgba(15,164,175,0.1)', margin: '0 0 1.75rem' }}/>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {[['Category', grievance.category], ['Priority', grievance.priority], ['Submitted', new Date(grievance.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })], ['Location', grievance.location?.address || 'Not specified']].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.35rem' }}>{label}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', color: '#003135', fontWeight: '600', textTransform: 'capitalize' }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: '#F8F6F0', borderRadius: '10px', padding: '1.25rem', marginBottom: grievance.updates?.length > 0 ? '1.5rem' : 0 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.6rem' }}>Description</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#003135', lineHeight: 1.7 }}>{grievance.description}</p>
              </div>

              {grievance.updates?.length > 0 && (
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '1rem' }}>Status Updates</p>
                  {grievance.updates.map((u, i) => (
                    <div key={i} style={{ borderLeft: '3px solid #0FA4AF', paddingLeft: '1rem', marginBottom: '0.75rem' }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#003135', fontWeight: '500', marginBottom: '0.2rem' }}>{u.message}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>{new Date(u.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}