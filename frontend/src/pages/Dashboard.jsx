import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-orange-100 text-orange-600',
  high: 'bg-red-100 text-red-600',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [grievances, setGrievances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const { data } = await api.get('/grievances')
        setGrievances(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGrievances()
  }, [])

  const stats = {
    total: grievances.length,
    pending: grievances.filter(g => g.status === 'pending').length,
    inProgress: grievances.filter(g => g.status === 'in-progress').length,
    resolved: grievances.filter(g => g.status === 'resolved').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your reported issues</p>
        </div>
        <Link to="/submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm inline-flex items-center gap-2">
          <span>+</span> Report New Issue
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reports', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-opacity-20`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grievances list */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Your Reports</h2>
          <span className="text-sm text-gray-400">{grievances.length} total</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading your reports...</div>
        ) : grievances.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 mb-4">No reports yet</p>
            <Link to="/submit" className="text-blue-600 font-medium hover:underline text-sm">Report your first issue →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {grievances.map((g) => (
              <div key={g._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-gray-900 text-sm">{g.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[g.status]}`}>
                        {g.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[g.priority]}`}>
                        {g.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      <span>🏷️ {g.category}</span>
                      <span>📍 {g.location?.address || 'No location'}</span>
                      <span>🗓️ {new Date(g.createdAt).toLocaleDateString()}</span>
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{g.trackingId}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}