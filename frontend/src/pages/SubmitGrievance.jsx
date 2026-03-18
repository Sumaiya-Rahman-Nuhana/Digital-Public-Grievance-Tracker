import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const categories = ['road', 'drainage', 'water', 'electricity', 'healthcare', 'education', 'other']
const priorities = ['low', 'medium', 'high']

export default function SubmitGrievance() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', category: 'road', priority: 'medium',
    location: { address: '', coordinates: { lat: '', lng: '' } }
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)

  const getLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude }
          }
        }))
        setLocating(false)
      },
      () => { setLocating(false); setError('Could not get location.') }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/grievances', form)
      setSuccess(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Reported!</h2>
          <p className="text-gray-500 mb-4">Your tracking ID is:</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 font-mono text-blue-700 font-bold text-lg mb-6">
            {success.trackingId}
          </div>
          <p className="text-gray-400 text-sm mb-6">Save this ID to track your complaint status.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
              Go to Dashboard
            </button>
            <button onClick={() => { setSuccess(null); setForm({ title: '', description: '', category: 'road', priority: 'medium', location: { address: '', coordinates: { lat: '', lng: '' } } }) }}
              className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              Report Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Report a Civic Issue</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below to submit your complaint</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Title *</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Large pothole on Main Street near bus stop" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority *</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe the issue in detail. Include what you observed, how long it has been a problem, and any safety concerns..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Location Address</label>
          <div className="flex gap-2">
            <input type="text" value={form.location.address}
              onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street address or landmark" />
            <button type="button" onClick={getLocation} disabled={locating}
              className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-60">
              {locating ? '...' : '📍 GPS'}
            </button>
          </div>
          {form.location.coordinates.lat && (
            <p className="text-xs text-green-600 mt-1">
              ✓ GPS: {parseFloat(form.location.coordinates.lat).toFixed(4)}, {parseFloat(form.location.coordinates.lng).toFixed(4)}
            </p>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm">
          {loading ? 'Submitting...' : 'Submit Issue Report'}
        </button>
      </form>
    </div>
  )
}