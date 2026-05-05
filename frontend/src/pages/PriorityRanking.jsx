import { useEffect, useState } from 'react'
import api from '../api/axios'

const categoryIcons = {
  road: '🛣️', drainage: '🚰', water: '💧',
  electricity: '⚡', healthcare: '🏥', education: '🎓', other: '📋'
}

const getRankColor = (index) => {
  if (index === 0) return { bg: 'rgba(201,168,76,0.15)', border: '#C9A84C', badge: '#C9A84C', label: '🥇 #1' }
  if (index === 1) return { bg: 'rgba(175,221,229,0.15)', border: '#AFDDE5', badge: '#7A9A9C', label: '🥈 #2' }
  if (index === 2) return { bg: 'rgba(150,71,52,0.1)', border: '#964734', badge: '#964734', label: '🥉 #3' }
  return { bg: 'white', border: 'rgba(15,164,175,0.12)', badge: '#0FA4AF', label: `#${index + 1}` }
}

const getScoreLevel = (score) => {
  if (score >= 20) return { label: 'Critical', color: '#FF7A6B', bg: 'rgba(255,122,107,0.12)' }
  if (score >= 10) return { label: 'High', color: '#C9A84C', bg: 'rgba(201,168,76,0.12)' }
  if (score >= 5) return { label: 'Medium', color: '#0FA4AF', bg: 'rgba(15,164,175,0.12)' }
  return { label: 'Low', color: '#4CAF88', bg: 'rgba(76,175,136,0.12)' }
}

export default function PriorityRanking() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/priority/areas')
      .then(({ data }) => setAreas(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>
      {/* Header */}
      <div style={{ background: '#003135', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em' }}>
            Most Problematic Areas
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.55)', marginTop: '0.5rem' }}>
            Areas ranked by priority score — calculated from unresolved issues, overdue cases, upvotes and severity
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>

        {/* Score formula explanation */}
        <div style={{ background: '#024950', borderRadius: '14px', padding: '1.5rem 2rem', marginBottom: '2rem', border: '1px solid rgba(15,164,175,0.2)' }}>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#0FA4AF', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '1rem' }}>
            Priority Score Formula
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {[
              { factor: 'Overdue Issues', weight: '×5', color: '#FF7A6B', desc: 'Pending 7+ days' },
              { factor: 'High Priority', weight: '×4', color: '#C9A84C', desc: 'High severity cases' },
              { factor: 'Unresolved', weight: '×3', color: '#0FA4AF', desc: 'All pending cases' },
              { factor: 'Upvotes', weight: '×2', color: '#AFDDE5', desc: 'Community support' },
              { factor: 'Medium Priority', weight: '×2', color: '#7A9A9C', desc: 'Medium severity' },
              { factor: 'In Progress', weight: '×1', color: '#4CAF88', desc: 'Being worked on' },
            ].map((f) => (
              <div key={f.factor} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,49,53,0.4)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(15,164,175,0.15)' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: '800', color: f.color }}>{f.weight}</span>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: '700', color: '#AFDDE5' }}>{f.factor}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(175,221,229,0.5)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#003135' }}>
            Calculating priority scores...
          </div>
        ) : areas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '14px', border: '1.5px solid rgba(15,164,175,0.1)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#003135', marginBottom: '0.5rem' }}>No area data yet</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#7A9A9C' }}>Submit complaints with location addresses to see area rankings</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {areas.map((area, index) => {
              const rank = getRankColor(index)
              const level = getScoreLevel(area.score)
              const isExpanded = expanded === index

              return (
                <div key={area.area} style={{ background: rank.bg, borderRadius: '14px', border: `1.5px solid ${rank.border}`, boxShadow: '0 2px 16px rgba(0,49,53,0.06)', overflow: 'hidden', transition: 'all 0.3s' }}>
                  {/* Main row */}
                  <div style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', cursor: 'pointer' }}
                    onClick={() => setExpanded(isExpanded ? null : index)}>

                    {/* Rank badge */}
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#003135', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${rank.badge}` }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: index < 3 ? '1.1rem' : '0.9rem', fontWeight: '800', color: rank.badge }}>{rank.label}</span>
                    </div>

                    {/* Area info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: '700', color: '#003135' }}>{area.area}</h3>
                        <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '100px', background: level.bg, color: level.color, fontWeight: '700', fontFamily: "'DM Sans', sans-serif" }}>
                          {level.label} Risk
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#7A9A9C', fontFamily: "'DM Sans', sans-serif" }}>
                          {categoryIcons[area.topCategory]} Top: {area.topCategory}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                        {[
                          `📋 ${area.total} total`,
                          `⏳ ${area.unresolved} unresolved`,
                          area.overdue > 0 && `⚠️ ${area.overdue} overdue`,
                          `✅ ${area.resolutionRate}% resolved`,
                          `👍 ${area.upvotes} upvotes`,
                        ].filter(Boolean).map((item, j) => (
                          <span key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#7A9A9C' }}>{item}</span>
                        ))}
                      </div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '2.5rem', fontWeight: '800', color: level.color, lineHeight: 1 }}>{area.score}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#7A9A9C', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>Score</div>
                    </div>

                    {/* Expand arrow */}
                    <div style={{ color: '#0FA4AF', fontSize: '1.2rem', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>▼</div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ padding: '0 2rem 1rem' }}>
                    <div style={{ height: '6px', background: 'rgba(15,164,175,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${area.resolutionRate}%`, background: 'linear-gradient(90deg, #0FA4AF, #4CAF88)', borderRadius: '100px', transition: 'width 1s ease' }}/>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ padding: '0 2rem 1.5rem', borderTop: '1px solid rgba(15,164,175,0.1)' }}>
                      <div style={{ paddingTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>

                        {/* Status breakdown */}
                        <div style={{ background: 'white', borderRadius: '10px', padding: '1.25rem', border: '1px solid rgba(15,164,175,0.1)' }}>
                          <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', marginBottom: '0.875rem' }}>Status Breakdown</h4>
                          {[
                            { label: 'Unresolved', value: area.unresolved, color: '#C9A84C' },
                            { label: 'In Progress', value: area.inProgress, color: '#0FA4AF' },
                            { label: 'Resolved', value: area.resolved, color: '#4CAF88' },
                            { label: 'Overdue', value: area.overdue, color: '#FF7A6B' },
                          ].map((s) => (
                            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#003135' }}>{s.label}</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: '800', color: s.color }}>{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Priority breakdown */}
                        <div style={{ background: 'white', borderRadius: '10px', padding: '1.25rem', border: '1px solid rgba(15,164,175,0.1)' }}>
                          <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', marginBottom: '0.875rem' }}>Priority Breakdown</h4>
                          {[
                            { label: 'High Priority', value: area.high, color: '#FF7A6B' },
                            { label: 'Medium Priority', value: area.medium, color: '#C9A84C' },
                            { label: 'Low Priority', value: area.low, color: '#4CAF88' },
                          ].map((s) => (
                            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#003135' }}>{s.label}</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: '800', color: s.color }}>{s.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Categories */}
                        <div style={{ background: 'white', borderRadius: '10px', padding: '1.25rem', border: '1px solid rgba(15,164,175,0.1)' }}>
                          <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', marginBottom: '0.875rem' }}>Issue Categories</h4>
                          {Object.entries(area.categories).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#003135', textTransform: 'capitalize' }}>
                                {categoryIcons[cat]} {cat}
                              </span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', fontWeight: '800', color: '#0FA4AF' }}>{count}</span>
                            </div>
                          ))}
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
  )
}