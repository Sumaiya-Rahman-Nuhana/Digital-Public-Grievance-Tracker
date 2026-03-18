import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const categoryIcons = {
  road: '🛣️', drainage: '🚰', water: '💧', electricity: '⚡',
  healthcare: '🏥', education: '🎓', other: '📋'
}

const priorityColors = {
  low: 'text-gray-500', medium: 'text-orange-500', high: 'text-red-500'
}

export default function PublicFeed() {
  const { user } = useAuth()
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('latest')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [upvotingId, setUpvotingId] = useState(null)

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ sort })
        if (category) params.append('category', category)
        if (status) params.append('status', status)
        const { data } = await api.get(`/public/feed?${params}`)
        setGrievances(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [sort, category, status])

  const handleUpvote = async (id) => {
    if (!user) return alert('Please login to upvote')
    setUpvotingId(id)
    try {
      const { data } = await api.put(`/grievances/${id}/upvote`)
      setGrievances(prev => prev.map(g => g._id === id ? { ...g, upvotes: data.upvotes } : g))
    } catch (err) {
      console.error(err)
    } finally {
      setUpvotingId(null)
    }
  }

  const getDaysAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Public Complaint Feed</h1>
        <p className="text-gray-500 text-sm mt-1">All civic issues reported by citizens — transparent and publicly accessible</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sort by</span>
          <div className="flex gap-1">
            {[
              { value: 'latest', label: 'Latest' },
              { value: 'unresolved', label: 'Oldest Unresolved' },
              { value: 'upvotes', label: 'Most Upvoted' },
            ].map((s) => (
              <button key={s.value} onClick={() => setSort(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === s.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Categories</option>
          {['road','drainage','water','electricity','healthcare','education','other'].map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="">All Statuses</option>
          {['pending','in-progress','resolved','rejected'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <span className="text-xs text-gray-400 ml-auto">{grievances.length} issues</span>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-3xl mb-3">⏳</div>
          Loading public feed...
        </div>
      ) : grievances.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-3xl mb-3">📭</div>
          No issues found matching your filters
        </div>
      ) : (
        <div className="space-y-4">
          {grievances.map((g) => (
            <div key={g._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl mt-0.5 flex-shrink-0">{categoryIcons[g.category] || '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{g.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[g.status]}`}>
                        {g.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      <span className="capitalize font-medium text-gray-500">{g.category}</span>
                      {g.location?.address && <span>📍 {g.location.address}</span>}
                      <span>🕐 {getDaysAgo(g.createdAt)}</span>
                      <span className={`font-medium ${priorityColors[g.priority]}`}>
                        {g.priority === 'high' ? '🔴' : g.priority === 'medium' ? '🟡' : '🟢'} {g.priority} priority
                      </span>
                      {g.submittedBy?.name && <span>by {g.submittedBy.name}</span>}
                    </div>
                  </div>
                </div>

                <button onClick={() => handleUpvote(g._id)} disabled={upvotingId === g._id}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-60 flex-shrink-0 group">
                  <span className="text-sm group-hover:scale-110 transition-transform">👍</span>
                  <span className="text-xs font-semibold text-gray-600">{g.upvotes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}