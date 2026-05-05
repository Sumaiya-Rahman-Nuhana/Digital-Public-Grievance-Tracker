import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api/axios'

// Fix leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Color-coded markers based on status
const createColorMarker = (status) => {
  const colors = {
    pending: '#C9A84C',
    'in-progress': '#0FA4AF',
    resolved: '#4CAF88',
    rejected: '#FF7A6B',
  }
  const color = colors[status] || '#7A9A9C'

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
        background: ${color}; border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        transform: rotate(-45deg);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })
}

const categoryIcons = {
  road: '🛣️', drainage: '🚰', water: '💧',
  electricity: '⚡', healthcare: '🏥', education: '🎓', other: '📋'
}

const statusConfig = {
  pending: { color: '#C9A84C', bg: 'rgba(201,168,76,0.12)', label: 'Pending' },
  'in-progress': { color: '#0FA4AF', bg: 'rgba(15,164,175,0.12)', label: 'In Progress' },
  resolved: { color: '#4CAF88', bg: 'rgba(76,175,136,0.12)', label: 'Resolved' },
  rejected: { color: '#FF7A6B', bg: 'rgba(255,122,107,0.12)', label: 'Rejected' },
}

// Component to fit map bounds to markers
function FitBounds({ markers }) {
  const map = useMap()
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = markers
        .filter(m => m.location?.coordinates?.lat && m.location?.coordinates?.lng)
        .map(m => [m.location.coordinates.lat, m.location.coordinates.lng])
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [markers, map])
  return null
}

export default function MapView() {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedMarker, setSelectedMarker] = useState(null)

  useEffect(() => {
    api.get('/map/markers')
      .then(({ data }) => setMarkers(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredMarkers = filter === 'all'
    ? markers
    : markers.filter(m => m.status === filter)

  const counts = {
    all: markers.length,
    pending: markers.filter(m => m.status === 'pending').length,
    'in-progress': markers.filter(m => m.status === 'in-progress').length,
    resolved: markers.filter(m => m.status === 'resolved').length,
  }

  // Default center — Bangladesh
  const defaultCenter = [23.685, 90.3563]

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>
      {/* Header */}
      <div style={{ background: '#003135', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em' }}>
            Interactive Issue Map
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.55)', marginTop: '0.5rem' }}>
            All reported civic issues visualized on a live map with color-coded status markers
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        {/* Legend + Filter */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', border: '1.5px solid rgba(15,164,175,0.12)', boxShadow: '0 2px 16px rgba(0,49,53,0.05)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Legend:</span>
            {Object.entries(statusConfig).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: val.color, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}/>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#003135', fontWeight: '500' }}>{val.label}</span>
              </div>
            ))}
          </div>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[{ v: 'all', l: `All (${counts.all})` }, { v: 'pending', l: `Pending (${counts.pending})` }, { v: 'in-progress', l: `In Progress (${counts['in-progress']})` }, { v: 'resolved', l: `Resolved (${counts.resolved})` }].map(({ v, l }) => (
              <button key={v} onClick={() => setFilter(v)} style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', background: filter === v ? '#003135' : '#F8F6F0', color: filter === v ? '#0FA4AF' : '#7A9A9C', border: filter === v ? '1.5px solid rgba(15,164,175,0.3)' : '1.5px solid transparent' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1.5px solid rgba(15,164,175,0.15)', boxShadow: '0 4px 24px rgba(0,49,53,0.08)', height: '580px' }}>
          {loading ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#024950' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#AFDDE5', marginBottom: '0.5rem' }}>Loading map...</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'rgba(175,221,229,0.5)' }}>Fetching issue locations</div>
              </div>
            </div>
          ) : (
            <MapContainer
              center={defaultCenter}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredMarkers.length > 0 && <FitBounds markers={filteredMarkers} />}
              {filteredMarkers.map((grievance) => {
                const lat = grievance.location?.coordinates?.lat
                const lng = grievance.location?.coordinates?.lng
                if (!lat || !lng) return null
                const sc = statusConfig[grievance.status] || statusConfig.pending
                return (
                  <Marker
                    key={grievance._id}
                    position={[lat, lng]}
                    icon={createColorMarker(grievance.status)}
                    eventHandlers={{ click: () => setSelectedMarker(grievance) }}
                  >
                    <Popup maxWidth={280}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", padding: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '1.25rem' }}>{categoryIcons[grievance.category] || '📋'}</span>
                          <span style={{ fontWeight: '700', color: '#003135', fontSize: '0.9rem', lineHeight: 1.3 }}>{grievance.title}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '100px', background: sc.bg, color: sc.color, fontWeight: '700', textTransform: 'capitalize' }}>{grievance.status}</span>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '100px', background: '#F8F6F0', color: '#7A9A9C', textTransform: 'capitalize', fontWeight: '500' }}>{grievance.category}</span>
                        </div>
                        {grievance.location?.address && (
                          <p style={{ fontSize: '0.78rem', color: '#7A9A9C', marginBottom: '6px' }}>📍 {grievance.location.address}</p>
                        )}
                        <p style={{ fontSize: '0.72rem', color: '#7A9A9C', marginBottom: '6px' }}>🗓 {new Date(grievance.createdAt).toLocaleDateString()}</p>
                        <div style={{ fontSize: '0.7rem', color: '#0FA4AF', fontFamily: 'monospace', fontWeight: '700', background: 'rgba(15,164,175,0.08)', padding: '3px 8px', borderRadius: '4px', display: 'inline-block' }}>
                          {grievance.trackingId}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          )}
        </div>

        {/* No markers message */}
        {!loading && filteredMarkers.filter(m => m.location?.coordinates?.lat).length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '12px', marginTop: '1rem', border: '1.5px solid rgba(15,164,175,0.1)' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#7A9A9C', fontSize: '0.9rem' }}>
              No issues with GPS coordinates found. Submit issues with GPS location to see them on the map.
            </p>
          </div>
        )}

        {/* Stats below map */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {[
            { label: 'Total on Map', value: markers.length, color: '#0FA4AF' },
            { label: 'Pending', value: counts.pending, color: '#C9A84C' },
            { label: 'In Progress', value: counts['in-progress'], color: '#0FA4AF' },
            { label: 'Resolved', value: counts.resolved, color: '#4CAF88' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1.5px solid rgba(15,164,175,0.1)', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,49,53,0.05)' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#7A9A9C', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', marginTop: '0.35rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}