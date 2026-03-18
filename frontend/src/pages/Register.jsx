import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true); setError('')
    try { const { data } = await api.post('/auth/register', form); login(data); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.') }
    finally { setLoading(false) }
  }

  const iStyle = { width: '100%', padding: '0.9rem 1.1rem', borderRadius: '9px', fontSize: '0.95rem', background: 'rgba(0,49,53,0.4)', border: '1.5px solid rgba(15,164,175,0.25)', color: '#F8F6F0', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.2s' }
  const lStyle = { display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.6rem' }
  const fields = [{ label: 'Full Name', type: 'text', key: 'name', ph: 'Your full name' }, { label: 'Email Address', type: 'email', key: 'email', ph: 'you@example.com' }, { label: 'Phone (optional)', type: 'tel', key: 'phone', ph: '+880 1XX XXX XXXX' }, { label: 'Password', type: 'password', key: 'password', ph: 'Min. 6 characters' }]

  return (
    <div style={{ minHeight: '100vh', background: '#003135', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(175,221,229,0.07) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,71,52,0.08) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }}/>

      <div className="afu" style={{ width: '100%', maxWidth: '440px', background: 'rgba(2,73,80,0.8)', backdropFilter: 'blur(20px)', borderRadius: '18px', padding: '3rem', position: 'relative', zIndex: 1, border: '1px solid rgba(15,164,175,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.2rem', fontWeight: '500', color: '#F8F6F0', marginBottom: '0.4rem' }}>Create Account</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.5)', fontWeight: '300' }}>Join the civic accountability movement</p>
        </div>

        {error && <div style={{ background: 'rgba(150,71,52,0.2)', border: '1px solid rgba(150,71,52,0.4)', color: '#FFAA88', padding: '0.875rem 1rem', borderRadius: '9px', fontSize: '0.875rem', marginBottom: '1.5rem', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {fields.map(({ label, type, key, ph }) => (
            <div key={key}>
              <label style={lStyle}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key !== 'phone'} placeholder={ph} style={iStyle}
                onFocus={e => { e.target.style.borderColor = '#0FA4AF'; e.target.style.boxShadow = '0 0 0 3px rgba(15,164,175,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(15,164,175,0.25)'; e.target.style.boxShadow = 'none' }}/>
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ background: '#0FA4AF', color: '#003135', padding: '0.95rem', borderRadius: '9px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, border: 'none', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', transition: 'all 0.2s', marginTop: '0.5rem', boxShadow: '0 4px 16px rgba(15,164,175,0.3)' }}
            onMouseOver={e => !loading && (e.target.style.background = '#AFDDE5')}
            onMouseOut={e => !loading && (e.target.style.background = '#0FA4AF')}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(15,164,175,0.15)' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'rgba(175,221,229,0.4)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0FA4AF', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}