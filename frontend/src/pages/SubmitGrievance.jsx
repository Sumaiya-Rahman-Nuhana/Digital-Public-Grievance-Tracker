import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const categories = ['road', 'drainage', 'water', 'electricity', 'healthcare', 'education', 'other']
const priorities = ['low', 'medium', 'high']

export default function SubmitGrievance() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', category: 'road', priority: 'medium', location: { address: '', coordinates: { lat: '', lng: '' } } })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => { setForm(prev => ({ ...prev, location: { ...prev.location, coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude } } })); setLocating(false) },
      () => { setLocating(false); setError('Could not get location.') }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try { const { data } = await api.post('/grievances', form); setSuccess(data) }
    catch (err) { setError(err.response?.data?.message || 'Submission failed.') }
    finally { setLoading(false) }
  }

  const iStyle = { width: '100%', padding: '0.9rem 1.1rem', borderRadius: '9px', fontSize: '0.95rem', background: 'white', border: '1.5px solid rgba(15,164,175,0.2)', color: '#003135', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.2s' }
  const lStyle = { display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.6rem' }
  const onF = e => { e.target.style.borderColor = '#0FA4AF'; e.target.style.boxShadow = '0 0 0 3px rgba(15,164,175,0.1)' }
  const onB = e => { e.target.style.borderColor = 'rgba(15,164,175,0.2)'; e.target.style.boxShadow = 'none' }

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="afu" style={{ background: 'white', borderRadius: '18px', padding: '3.5rem', maxWidth: '480px', width: '100%', textAlign: 'center', border: '1.5px solid rgba(15,164,175,0.2)', boxShadow: '0 10px 50px rgba(0,49,53,0.1)' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(76,175,136,0.12)', border: '2px solid rgba(76,175,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✅</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.2rem', fontWeight: '500', color: '#003135', marginBottom: '0.75rem' }}>Issue Reported!</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: '#7A9A9C', marginBottom: '1.75rem' }}>Your complaint has been submitted successfully. Save your tracking ID below.</p>
        <div style={{ background: '#F8F6F0', border: '1.5px solid rgba(15,164,175,0.3)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#0FA4AF', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Your Tracking ID</p>
          <p style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: '700', color: '#003135', letterSpacing: '0.08em' }}>{success.trackingId}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#003135', color: '#AFDDE5', padding: '0.8rem 1.6rem', borderRadius: '9px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', border: '2px solid #003135', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#0FA4AF'; e.currentTarget.style.borderColor = '#0FA4AF'; e.currentTarget.style.color = '#003135' }}
            onMouseOut={e => { e.currentTarget.style.background = '#003135'; e.currentTarget.style.borderColor = '#003135'; e.currentTarget.style.color = '#AFDDE5' }}>
            Go to Dashboard
          </button>
          <button onClick={() => { setSuccess(null); setForm({ title: '', description: '', category: 'road', priority: 'medium', location: { address: '', coordinates: { lat: '', lng: '' } } }) }}
            style={{ background: 'transparent', color: '#003135', padding: '0.8rem 1.6rem', borderRadius: '9px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', border: '1.5px solid rgba(15,164,175,0.3)', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
            Report Another
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>
      <div style={{ background: '#003135', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#0FA4AF', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>New Report</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em' }}>Report a Civic Issue</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.55)', marginTop: '0.5rem', fontWeight: '300' }}>Fill in the details to submit your complaint to relevant authorities</p>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem' }}>
        {error && <div style={{ background: 'rgba(150,71,52,0.1)', border: '1.5px solid rgba(150,71,52,0.3)', color: '#964734', padding: '0.875rem 1rem', borderRadius: '9px', fontSize: '0.9rem', marginBottom: '1.5rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 4px 24px rgba(0,49,53,0.06)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={lStyle}>Issue Title *</label>
            <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Large pothole on Main Street near bus stop" style={iStyle} onFocus={onF} onBlur={onB}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={lStyle}>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...iStyle, cursor: 'pointer' }} onFocus={onF} onBlur={onB}>
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Priority *</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ ...iStyle, cursor: 'pointer' }} onFocus={onF} onBlur={onB}>
                {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={lStyle}>Description *</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Describe the issue in detail — what you observed, how long it has been a problem, any safety concerns..." style={{ ...iStyle, resize: 'none', lineHeight: 1.65 }} onFocus={onF} onBlur={onB}/>
          </div>

          <div>
            <label style={lStyle}>Location Address</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input type="text" value={form.location.address} onChange={e => setForm({ ...form, location: { ...form.location, address: e.target.value } })} placeholder="Street address or landmark" style={{ ...iStyle, flex: 1 }} onFocus={onF} onBlur={onB}/>
              <button type="button" onClick={getLocation} disabled={locating} style={{ padding: '0.9rem 1.25rem', borderRadius: '9px', background: '#024950', color: '#AFDDE5', border: '1.5px solid rgba(15,164,175,0.3)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#003135'}
                onMouseOut={e => e.currentTarget.style.background = '#024950'}>
                {locating ? '...' : '📍 GPS'}
              </button>
            </div>
            {form.location.coordinates.lat && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#4CAF88', marginTop: '0.5rem', fontWeight: '600' }}>
                ✓ GPS captured: {parseFloat(form.location.coordinates.lat).toFixed(4)}, {parseFloat(form.location.coordinates.lng).toFixed(4)}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} style={{ background: '#003135', color: '#AFDDE5', padding: '1rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, border: '2px solid #003135', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', transition: 'all 0.2s', marginTop: '0.5rem', boxShadow: '0 4px 16px rgba(0,49,53,0.2)' }}
            onMouseOver={e => !loading && (e.currentTarget.style.background = '#0FA4AF')}
            onMouseOut={e => !loading && (e.currentTarget.style.background = '#003135')}>
            {loading ? 'Submitting Report...' : 'Submit Issue Report →'}
          </button>
        </form>
      </div>
    </div>
  )
}