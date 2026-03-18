import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const stats = [
  { label: 'Issues Reported', value: '2,847' },
  { label: 'Issues Resolved', value: '1,923' },
  { label: 'Active Citizens', value: '5,210' },
  { label: 'Avg Resolution', value: '4.2 days' },
]

const categories = [
  { icon: '🛣️', name: 'Roads', desc: 'Potholes, signals, pavements' },
  { icon: '💧', name: 'Water', desc: 'Leaks, contamination, shortage' },
  { icon: '⚡', name: 'Electricity', desc: 'Outages, faulty wiring, billing' },
  { icon: '🏥', name: 'Healthcare', desc: 'Clinics, sanitation, waste' },
  { icon: '🎓', name: 'Education', desc: 'Schools, facilities, access' },
  { icon: '🚰', name: 'Drainage', desc: 'Flooding, blocked drains' },
]

const BtnPrimary = ({ to, children }) => (
  <Link to={to} style={{ display: 'inline-block', background: '#0FA4AF', color: '#003135', padding: '0.9rem 2.2rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em', border: '2px solid #0FA4AF', transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(15,164,175,0.35)' }}
    onMouseOver={e => { e.currentTarget.style.background = '#AFDDE5'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(15,164,175,0.45)' }}
    onMouseOut={e => { e.currentTarget.style.background = '#0FA4AF'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,164,175,0.35)' }}>
    {children}
  </Link>
)

const BtnOutline = ({ to, children }) => (
  <Link to={to} style={{ display: 'inline-block', background: 'transparent', color: '#AFDDE5', padding: '0.9rem 2.2rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em', border: '2px solid rgba(175,221,229,0.5)', transition: 'all 0.25s' }}
    onMouseOver={e => { e.currentTarget.style.borderColor = '#AFDDE5'; e.currentTarget.style.background = 'rgba(175,221,229,0.1)' }}
    onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(175,221,229,0.5)'; e.currentTarget.style.background = 'transparent' }}>
    {children}
  </Link>
)

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* HERO */}
      <section style={{ background: '#003135', minHeight: '88vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '4rem 2rem' }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,164,175,0.18) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,71,52,0.12) 0%, transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(15,164,175,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,164,175,0.05) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }}/>

        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="afu" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', padding: '7px 18px', borderRadius: '100px', border: '1px solid rgba(15,164,175,0.4)', background: 'rgba(15,164,175,0.08)' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0FA4AF', animation: 'pulse-dot 2s infinite' }}/>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#AFDDE5', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>Civic Issue Reporting Platform — Bangladesh</span>
          </div>

          <h1 className="afu d1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(3.5rem, 7vw, 6rem)', fontWeight: '400', lineHeight: '1.08', color: '#F8F6F0', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Report. Track.<br/>
            <em style={{ fontStyle: 'italic', color: '#0FA4AF' }}>Resolve Together.</em>
          </h1>

          <p className="afu d2" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', color: 'rgba(175,221,229,0.75)', lineHeight: '1.75', marginBottom: '3rem', maxWidth: '560px', fontWeight: '300' }}>
            A transparent civic platform where citizens report local problems, track resolutions in real time, and hold authorities accountable.
          </p>

          <div className="afu d3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <BtnPrimary to={user ? '/submit' : '/register'}>
              {user ? '+ Report an Issue' : 'Get Started Free →'}
            </BtnPrimary>
            <BtnOutline to="/feed">View Public Feed</BtnOutline>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#024950', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '2rem 1rem', borderRight: i < stats.length - 1 ? '1px solid rgba(175,221,229,0.1)' : 'none' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '3rem', fontWeight: '800', color: '#0FA4AF', lineHeight: 1, marginBottom: '0.5rem' }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: 'rgba(175,221,229,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ background: '#F8F6F0', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#0FA4AF', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>What You Can Report</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '500', color: '#003135', letterSpacing: '-0.02em' }}>Report Any Civic Issue</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: '#7A9A9C', marginTop: '0.75rem' }}>From roads to education — every civic problem deserves attention</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {categories.map((cat) => (
              <Link to="/submit" key={cat.name} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ background: 'white', borderRadius: '14px', padding: '1.75rem', border: '2px solid rgba(15,164,175,0.12)', boxShadow: '0 2px 16px rgba(0,49,53,0.05)', transition: 'all 0.25s', cursor: 'pointer' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#0FA4AF'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(15,164,175,0.18)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(15,164,175,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,49,53,0.05)' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.875rem' }}>{cat.icon}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: '700', color: '#003135', marginBottom: '0.35rem' }}>{cat.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#7A9A9C', lineHeight: 1.5 }}>{cat.desc}</div>
                  <div style={{ marginTop: '1.25rem', color: '#0FA4AF', fontSize: '0.85rem', fontWeight: '700', fontFamily: "'DM Sans', sans-serif" }}>Report now →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#024950', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#0FA4AF', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.75rem' }}>The Process</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '500', color: '#F8F6F0', letterSpacing: '-0.02em' }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '1', title: 'Report the Issue', desc: 'Submit your complaint with GPS location and detailed description. Takes under 2 minutes.', icon: '📝' },
              { step: '2', title: 'Track in Real Time', desc: 'Receive a unique tracking ID. Follow your complaint from submission through to resolution.', icon: '📍' },
              { step: '3', title: 'See It Resolved', desc: 'Authorities respond, update status, and the community stays informed through the public feed.', icon: '✅' },
            ].map((item) => (
              <div key={item.step} style={{ background: 'rgba(0,49,53,0.6)', borderRadius: '16px', padding: '2.5rem', border: '1px solid rgba(15,164,175,0.25)', position: 'relative', overflow: 'hidden' }}>
                {/* Visible step number badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '12px', background: '#0FA4AF', marginBottom: '1.25rem', boxShadow: '0 4px 14px rgba(15,164,175,0.4)' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: '800', color: '#003135', lineHeight: 1 }}>{item.step}</span>
                </div>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', fontWeight: '700', color: '#AFDDE5', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.6)', lineHeight: 1.7 }}>{item.desc}</p>
                <div style={{ marginTop: '1.5rem', height: '2px', width: '50px', background: 'linear-gradient(90deg, #0FA4AF, transparent)' }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#003135', padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(15,164,175,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            Ready to Make <em style={{ fontStyle: 'italic', color: '#0FA4AF' }}>a Difference?</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', color: 'rgba(175,221,229,0.6)', marginBottom: '2.5rem', lineHeight: 1.7, fontWeight: '300' }}>
            Join thousands of citizens actively improving their communities through transparent reporting and accountability.
          </p>
          <BtnPrimary to={user ? '/submit' : '/register'}>
            {user ? '+ Report an Issue Now' : 'Create Free Account →'}
          </BtnPrimary>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#001F22', padding: '1.75rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(15,164,175,0.15)' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'rgba(175,221,229,0.35)', letterSpacing: '0.04em' }}>
          © 2026 GrievanceTracker — Digital Public Accountability Platform
        </p>
      </footer>
    </div>
  )
}