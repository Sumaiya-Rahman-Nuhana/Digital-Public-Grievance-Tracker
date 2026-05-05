import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const statusConfig = {
  pending: { color: '#C9A84C', bg: 'rgba(201,168,76,0.12)' },
  'in-progress': { color: '#0FA4AF', bg: 'rgba(15,164,175,0.12)' },
  resolved: { color: '#4CAF88', bg: 'rgba(76,175,136,0.12)' },
  rejected: { color: '#FF7A6B', bg: 'rgba(255,122,107,0.12)' },
}

const priorityDot = { low: '#4CAF88', medium: '#C9A84C', high: '#FF7A6B' }

const categoryIcons = {
  road: '🛣️', drainage: '🚰', water: '💧',
  electricity: '⚡', healthcare: '🏥', education: '🎓', other: '📋'
}

const initialFilters = {
  keyword: '',
  category: 'all',
  status: 'all',
  priority: 'all',
  area: '',
  dateFrom: '',
  dateTo: '',
  sort: 'latest',
}

export default function SearchFilter() {
  const [filters, setFilters] = useState(initialFilters)
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const buildParams = useCallback((pg = 1) => {
    const params = new URLSearchParams()
    if (filters.keyword.trim()) params.append('keyword', filters.keyword.trim())
    if (filters.category !== 'all') params.append('category', filters.category)
    if (filters.status !== 'all') params.append('status', filters.status)
    if (filters.priority !== 'all') params.append('priority', filters.priority)
    if (filters.area.trim()) params.append('area', filters.area.trim())
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.append('dateTo', filters.dateTo)
    params.append('sort', filters.sort)
    params.append('page', pg)
    params.append('limit', 10)
    return params.toString()
  }, [filters])

  const handleSearch = async (pg = 1) => {
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await api.get(`/search?${buildParams(pg)}`)
      setResults(data.grievances)
      setTotal(data.total)
      setPages(data.pages)
      setPage(pg)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setResults([])
    setTotal(0)
    setSearched(false)
    setPage(1)
  }

  // Auto search when sort changes if already searched
  useEffect(() => {
    if (searched) handleSearch(1)
  }, [filters.sort])

  const iStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', background: '#F8F6F0', border: '1.5px solid rgba(15,164,175,0.2)', color: '#003135', fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.2s' }
  const lStyle = { display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#7A9A9C', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }
  const onF = e => { e.target.style.borderColor = '#0FA4AF'; e.target.style.boxShadow = '0 0 0 3px rgba(15,164,175,0.1)' }
  const onB = e => { e.target.style.borderColor = 'rgba(15,164,175,0.2)'; e.target.style.boxShadow = 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>
      {/* Header */}
      <div style={{ background: '#003135', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em' }}>
            Search & Filter Issues
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.55)', marginTop: '0.5rem' }}>
            Search by keyword, filter by category, area, status, priority and date range
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {/* Search & Filter Panel */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 4px 20px rgba(0,49,53,0.06)', marginBottom: '2rem' }}>

          {/* Keyword search */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={lStyle}>Keyword Search</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={filters.keyword}
                onChange={e => updateFilter('keyword', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(1)}
                placeholder="Search by title, description or tracking ID..."
                style={{ ...iStyle, flex: 1, fontSize: '0.95rem' }}
                onFocus={onF} onBlur={onB}
              />
              <button onClick={() => handleSearch(1)} disabled={loading}
                style={{ background: '#003135', color: '#AFDDE5', padding: '0.75rem 1.75rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', border: '2px solid #003135', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,49,53,0.2)' }}
                onMouseOver={e => e.currentTarget.style.background = '#0FA4AF'}
                onMouseOut={e => e.currentTarget.style.background = '#003135'}>
                {loading ? 'Searching...' : '🔍 Search'}
              </button>
            </div>
          </div>

          {/* Filters grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Category */}
            <div>
              <label style={lStyle}>Category</label>
              <select value={filters.category} onChange={e => updateFilter('category', e.target.value)} style={iStyle} onFocus={onF} onBlur={onB}>
                <option value="all">All Categories</option>
                {['road', 'drainage', 'water', 'electricity', 'healthcare', 'education', 'other'].map(c => (
                  <option key={c} value={c}>{categoryIcons[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={lStyle}>Status</label>
              <select value={filters.status} onChange={e => updateFilter('status', e.target.value)} style={iStyle} onFocus={onF} onBlur={onB}>
                <option value="all">All Statuses</option>
                {['pending', 'in-progress', 'resolved', 'rejected'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label style={lStyle}>Priority</label>
              <select value={filters.priority} onChange={e => updateFilter('priority', e.target.value)} style={iStyle} onFocus={onF} onBlur={onB}>
                <option value="all">All Priorities</option>
                {['high', 'medium', 'low'].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label style={lStyle}>Geographic Area</label>
              <input type="text" value={filters.area} onChange={e => updateFilter('area', e.target.value)}
                placeholder="e.g. Dhaka, Mirpur..." style={iStyle} onFocus={onF} onBlur={onB} />
            </div>

            {/* Date From */}
            <div>
              <label style={lStyle}>Date From</label>
              <input type="date" value={filters.dateFrom} onChange={e => updateFilter('dateFrom', e.target.value)}
                style={iStyle} onFocus={onF} onBlur={onB} />
            </div>

            {/* Date To */}
            <div>
              <label style={lStyle}>Date To</label>
              <input type="date" value={filters.dateTo} onChange={e => updateFilter('dateTo', e.target.value)}
                style={iStyle} onFocus={onF} onBlur={onB} />
            </div>
          </div>

          {/* Sort + Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', fontWeight: '700', alignSelf: 'center' }}>Sort:</span>
              {[{ v: 'latest', l: 'Latest' }, { v: 'oldest', l: 'Oldest' }, { v: 'upvotes', l: 'Most Upvoted' }, { v: 'priority', l: 'Priority' }].map(({ v, l }) => (
                <button key={v} onClick={() => updateFilter('sort', v)}
                  style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', background: filters.sort === v ? '#003135' : '#F8F6F0', color: filters.sort === v ? '#0FA4AF' : '#7A9A9C', border: filters.sort === v ? '1.5px solid rgba(15,164,175,0.3)' : '1.5px solid transparent' }}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={handleReset}
              style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: '600', background: 'transparent', color: '#964734', border: '1.5px solid rgba(150,71,52,0.3)', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(150,71,52,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              ✕ Reset Filters
            </button>
          </div>
        </div>

        {/* Active filters display */}
        {searched && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', fontWeight: '700' }}>Active filters:</span>
            {filters.keyword && <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(15,164,175,0.12)', color: '#0FA4AF', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>🔍 "{filters.keyword}"</span>}
            {filters.category !== 'all' && <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(15,164,175,0.12)', color: '#0FA4AF', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Category: {filters.category}</span>}
            {filters.status !== 'all' && <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(15,164,175,0.12)', color: '#0FA4AF', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Status: {filters.status}</span>}
            {filters.priority !== 'all' && <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(15,164,175,0.12)', color: '#0FA4AF', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Priority: {filters.priority}</span>}
            {filters.area && <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(15,164,175,0.12)', color: '#0FA4AF', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>Area: {filters.area}</span>}
            {filters.dateFrom && <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(15,164,175,0.12)', color: '#0FA4AF', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>From: {filters.dateFrom}</span>}
            {filters.dateTo && <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(15,164,175,0.12)', color: '#0FA4AF', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>To: {filters.dateTo}</span>}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#003135' }}>
            Searching...
          </div>
        ) : searched ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: '500', color: '#003135' }}>
                {total === 0 ? 'No results found' : `${total} result${total !== 1 ? 's' : ''} found`}
              </h2>
              {total > 0 && (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#7A9A9C' }}>
                  Page {page} of {pages}
                </span>
              )}
            </div>

            {total === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '14px', border: '1.5px solid rgba(15,164,175,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#003135', marginBottom: '0.5rem' }}>No issues match your search</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#7A9A9C' }}>Try different keywords or adjust your filters</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {results.map((g) => {
                    const sc = statusConfig[g.status] || statusConfig.pending
                    return (
                      <div key={g._id} style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 16px rgba(0,49,53,0.04)', transition: 'all 0.25s' }}
                        onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(15,164,175,0.12)'; e.currentTarget.style.borderColor = 'rgba(15,164,175,0.25)' }}
                        onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,49,53,0.04)'; e.currentTarget.style.borderColor = 'rgba(15,164,175,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0, border: '1.5px solid rgba(15,164,175,0.1)' }}>
                            {categoryIcons[g.category] || '📋'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: priorityDot[g.priority], flexShrink: 0 }}/>
                              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: '700', color: '#003135', fontSize: '0.95rem' }}>{g.title}</h3>
                              <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '100px', background: sc.bg, color: sc.color, fontWeight: '700', textTransform: 'capitalize', fontFamily: "'DM Sans', sans-serif" }}>
                                {g.status}
                              </span>
                            </div>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#7A9A9C', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                              {g.description?.slice(0, 120)}{g.description?.length > 120 ? '...' : ''}
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', textTransform: 'capitalize' }}>🏷 {g.category}</span>
                              {g.location?.address && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>📍 {g.location.address}</span>}
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>🗓 {new Date(g.createdAt).toLocaleDateString()}</span>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>👍 {g.upvotes || 0}</span>
                              {g.submittedBy?.name && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>by {g.submittedBy.name}</span>}
                            </div>
                          </div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#0FA4AF', background: 'rgba(15,164,175,0.08)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(15,164,175,0.2)', flexShrink: 0, fontWeight: '700' }}>
                            {g.trackingId}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleSearch(page - 1)} disabled={page === 1}
                      style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: '600', background: '#F8F6F0', color: page === 1 ? '#7A9A9C' : '#003135', border: '1.5px solid rgba(15,164,175,0.2)', opacity: page === 1 ? 0.5 : 1 }}>
                      ← Prev
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => handleSearch(p)}
                        style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: '700', background: p === page ? '#003135' : '#F8F6F0', color: p === page ? '#0FA4AF' : '#003135', border: p === page ? '1.5px solid rgba(15,164,175,0.3)' : '1.5px solid rgba(15,164,175,0.15)' }}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => handleSearch(page + 1)} disabled={page === pages}
                      style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif", cursor: page === pages ? 'not-allowed' : 'pointer', fontWeight: '600', background: '#F8F6F0', color: page === pages ? '#7A9A9C' : '#003135', border: '1.5px solid rgba(15,164,175,0.2)', opacity: page === pages ? 0.5 : 1 }}>
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '14px', border: '1.5px solid rgba(15,164,175,0.1)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#003135', marginBottom: '0.5rem' }}>Search for Issues</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#7A9A9C' }}>Use the filters above and click Search to find complaints</p>
          </div>
        )}
      </div>
    </div>
  )
}