import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try { const { data } = await api.post('/auth/login', form); login(data); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.message || 'Login failed.') }
    finally { setLoading(false) }
  }

  const iStyle = { width: '100%', padding: '0.9rem 1.1rem', borderRadius: '9px', fontSize: '0.95rem', background: 'rgba(0,49,53,0.4)', border: '1.5px solid rgba(15,164,175,0.25)', color: '#F8F6F0', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.2s' }
  const lStyle = { display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.6rem' }

  return (
    <div style={{ minHeight: '100vh', background: '#003135', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,164,175,0.12) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,71,52,0.08) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }}/>

      <div className="afu" style={{ width: '100%', maxWidth: '440px', background: 'rgba(2,73,80,0.8)', backdropFilter: 'blur(20px)', borderRadius: '18px', padding: '3rem', position: 'relative', zIndex: 1, border: '1px solid rgba(15,164,175,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#003135', border: '1.5px solid rgba(15,164,175,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <svg width="28" height="28" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="7" fill="none" stroke="#0FA4AF" strokeWidth="1.5"/><circle cx="19" cy="19" r="3" fill="#C9A84C"/><path d="M19 8V12M19 26V30M8 19H12M26 19H30" stroke="#0FA4AF" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/></svg>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.2rem', fontWeight: '500', color: '#F8F6F0', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.5)', fontWeight: '300' }}>Sign in to your account</p>
        </div>

        {error && <div style={{ background: 'rgba(150,71,52,0.2)', border: '1px solid rgba(150,71,52,0.4)', color: '#FFAA88', padding: '0.875rem 1rem', borderRadius: '9px', fontSize: '0.875rem', marginBottom: '1.5rem', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[{ label: 'Email Address', type: 'email', key: 'email', ph: 'you@example.com' }, { label: 'Password', type: 'password', key: 'password', ph: '••••••••' }].map(({ label, type, key, ph }) => (
            <div key={key}>
              <label style={lStyle}>{label}</label>
              <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={iStyle}
                onFocus={e => { e.target.style.borderColor = '#0FA4AF'; e.target.style.boxShadow = '0 0 0 3px rgba(15,164,175,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(15,164,175,0.25)'; e.target.style.boxShadow = 'none' }}/>
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ background: '#0FA4AF', color: '#003135', padding: '0.95rem', borderRadius: '9px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, border: 'none', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em', transition: 'all 0.2s', marginTop: '0.5rem', boxShadow: '0 4px 16px rgba(15,164,175,0.3)' }}
            onMouseOver={e => !loading && (e.target.style.background = '#AFDDE5')}
            onMouseOut={e => !loading && (e.target.style.background = '#0FA4AF')}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(15,164,175,0.15)' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'rgba(175,221,229,0.4)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0FA4AF', textDecoration: 'none', fontWeight: '600' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}