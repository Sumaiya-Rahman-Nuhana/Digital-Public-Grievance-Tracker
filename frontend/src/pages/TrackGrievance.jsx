import { useState } from 'react'
import api from '../api/axios'

const statusSteps = ['pending', 'in-progress', 'resolved']
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

export default function TrackGrievance() {
  const [trackingId, setTrackingId] = useState('')
  const [grievance, setGrievance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGrievance(null)
    try {
      const { data } = await api.get(`/grievances/${trackingId}`)
      setGrievance(data)
    } catch (err) {
      setError('No complaint found with this tracking ID.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = grievance ? statusSteps.indexOf(grievance.status) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Track Your Issue</h1>
        <p className="text-gray-500 text-sm mt-1">Enter your tracking ID to see the current status</p>
      </div>

      <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tracking ID</label>
        <div className="flex gap-3">
          <input type="text" value={trackingId} onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            required className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="GRV-XXXXXXXX" />
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-60">
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {grievance && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-bold text-lg">{grievance.title}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[grievance.status]}`}>
                {grievance.status}
              </span>
            </div>
            <p className="text-blue-100 text-sm mt-1 font-mono">{grievance.trackingId}</p>
          </div>

          <div className="p-6">
            {/* Progress bar */}
            {grievance.status !== 'rejected' && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  {statusSteps.map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i <= currentStep ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs capitalize ${i <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{step}</span>
                    </div>
                  ))}
                </div>
                <div className="relative h-1.5 bg-gray-200 rounded-full mx-4">
                  <div className="absolute h-1.5 bg-blue-600 rounded-full transition-all"
                    style={{ width: currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : '100%' }} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div><span className="text-gray-400 block text-xs mb-0.5">Category</span><span className="font-medium capitalize">{grievance.category}</span></div>
              <div><span className="text-gray-400 block text-xs mb-0.5">Priority</span><span className="font-medium capitalize">{grievance.priority}</span></div>
              <div><span className="text-gray-400 block text-xs mb-0.5">Submitted</span><span className="font-medium">{new Date(grievance.createdAt).toLocaleDateString()}</span></div>
              <div><span className="text-gray-400 block text-xs mb-0.5">Location</span><span className="font-medium">{grievance.location?.address || 'Not specified'}</span></div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-700">{grievance.description}</p>
            </div>

            {grievance.updates?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Status Updates</h3>
                <div className="space-y-2">
                  {grievance.updates.map((u, i) => (
                    <div key={i} className="border-l-2 border-blue-300 pl-3 py-1">
                      <p className="text-sm text-gray-700">{u.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(u.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}