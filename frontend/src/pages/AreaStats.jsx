import { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement, Filler,
} from 'chart.js'
import api from '../api/axios'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement,
  PointElement, LineElement, Filler
)

const categoryIcons = {
  road: '🛣️', drainage: '🚰', water: '💧',
  electricity: '⚡', healthcare: '🏥', education: '🎓', other: '📋'
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AreaStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/map/stats')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#003135', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#AFDDE5', marginBottom: '0.5rem' }}>Loading statistics...</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: 'rgba(175,221,229,0.5)' }}>Crunching the numbers</div>
      </div>
    </div>
  )

  if (!stats) return null

  const { overview, categoryStats, monthlyTrend, priorityStats } = stats

  // Bar chart — category breakdown
  const barData = {
    labels: categoryStats.map(c => c._id.charAt(0).toUpperCase() + c._id.slice(1)),
    datasets: [{
      label: 'Total Issues',
      data: categoryStats.map(c => c.count),
      backgroundColor: ['rgba(15,164,175,0.8)', 'rgba(201,168,76,0.8)', 'rgba(150,71,52,0.8)', 'rgba(76,175,136,0.8)', 'rgba(175,221,229,0.8)', 'rgba(2,73,80,0.8)', 'rgba(255,122,107,0.8)'],
      borderColor: ['#0FA4AF', '#C9A84C', '#964734', '#4CAF88', '#AFDDE5', '#024950', '#FF7A6B'],
      borderWidth: 2,
      borderRadius: 8,
    }],
  }

  // Doughnut chart — status breakdown
  const doughnutData = {
    labels: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    datasets: [{
      data: [overview.pending, overview.inProgress, overview.resolved, overview.rejected],
      backgroundColor: ['rgba(201,168,76,0.85)', 'rgba(15,164,175,0.85)', 'rgba(76,175,136,0.85)', 'rgba(255,122,107,0.85)'],
      borderColor: ['#C9A84C', '#0FA4AF', '#4CAF88', '#FF7A6B'],
      borderWidth: 2,
    }],
  }

  // Line chart — monthly trend
  const lineData = {
    labels: monthlyTrend.map(m => `${monthNames[m._id.month - 1]} ${m._id.year}`),
    datasets: [
      {
        label: 'Reported',
        data: monthlyTrend.map(m => m.count),
        borderColor: '#0FA4AF',
        backgroundColor: 'rgba(15,164,175,0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0FA4AF',
        pointRadius: 5,
      },
      {
        label: 'Resolved',
        data: monthlyTrend.map(m => m.resolved),
        borderColor: '#4CAF88',
        backgroundColor: 'rgba(76,175,136,0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4CAF88',
        pointRadius: 5,
      },
    ],
  }

  // Priority doughnut
  const priorityData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [{
      data: [
        priorityStats.find(p => p._id === 'low')?.count || 0,
        priorityStats.find(p => p._id === 'medium')?.count || 0,
        priorityStats.find(p => p._id === 'high')?.count || 0,
      ],
      backgroundColor: ['rgba(76,175,136,0.85)', 'rgba(201,168,76,0.85)', 'rgba(255,122,107,0.85)'],
      borderColor: ['#4CAF88', '#C9A84C', '#FF7A6B'],
      borderWidth: 2,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#003135', font: { family: "'DM Sans', sans-serif", size: 12, weight: '600' } } },
      tooltip: { backgroundColor: '#003135', titleColor: '#AFDDE5', bodyColor: '#F8F6F0', borderColor: 'rgba(15,164,175,0.3)', borderWidth: 1 },
    },
    scales: {
      x: { ticks: { color: '#7A9A9C', font: { family: "'DM Sans', sans-serif", size: 11 } }, grid: { color: 'rgba(15,164,175,0.08)' } },
      y: { ticks: { color: '#7A9A9C', font: { family: "'DM Sans', sans-serif", size: 11 } }, grid: { color: 'rgba(15,164,175,0.08)' }, beginAtZero: true },
    },
  }

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#003135', font: { family: "'DM Sans', sans-serif", size: 12, weight: '600' }, padding: 16 } },
      tooltip: { backgroundColor: '#003135', titleColor: '#AFDDE5', bodyColor: '#F8F6F0', borderColor: 'rgba(15,164,175,0.3)', borderWidth: 1 },
    },
    cutout: '65%',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F0' }}>
      {/* Header */}
      <div style={{ background: '#003135', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '400', color: '#F8F6F0', letterSpacing: '-0.02em' }}>
            Area-Based Issue Statistics
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', color: 'rgba(175,221,229,0.55)', marginTop: '0.5rem' }}>
            Real-time statistical summaries of civic issues — transparency for citizens, journalists and NGOs
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>

        {/* Overview cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Reports', value: overview.total, color: '#0FA4AF', icon: '📋' },
            { label: 'Resolved', value: overview.resolved, color: '#4CAF88', icon: '✅' },
            { label: 'Pending', value: overview.pending, color: '#C9A84C', icon: '⏳' },
            { label: 'In Progress', value: overview.inProgress, color: '#0FA4AF', icon: '🔄' },
            { label: 'Overdue (7d+)', value: overview.overdue, color: '#FF7A6B', icon: '⚠️' },
            { label: 'Resolution Rate', value: `${overview.resolutionRate}%`, color: '#4CAF88', icon: '📈' },
            { label: 'Avg Resolution', value: `${overview.avgResolutionDays}d`, color: '#C9A84C', icon: '⏱️' },
            { label: 'Rejected', value: overview.rejected, color: '#FF7A6B', icon: '❌' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', padding: '1.25rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 12px rgba(0,49,53,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{s.icon}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '2rem', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '0.3rem' }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#7A9A9C', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Resolution progress bar */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.75rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 12px rgba(0,49,53,0.05)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: '500', color: '#003135' }}>Overall Resolution Progress</h3>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', fontWeight: '800', color: '#4CAF88' }}>{overview.resolutionRate}%</span>
          </div>
          <div style={{ height: '12px', background: 'rgba(15,164,175,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${overview.resolutionRate}%`, background: 'linear-gradient(90deg, #0FA4AF, #4CAF88)', borderRadius: '100px', transition: 'width 1s ease' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#7A9A9C' }}>{overview.resolved} resolved out of {overview.total} total</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: overview.overdue > 0 ? '#FF7A6B' : '#4CAF88', fontWeight: '700' }}>
              {overview.overdue > 0 ? `⚠️ ${overview.overdue} overdue` : '✅ No overdue issues'}
            </span>
          </div>
        </div>

        {/* Charts row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Status doughnut */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '1.75rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 12px rgba(0,49,53,0.05)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: '500', color: '#003135', marginBottom: '1.5rem' }}>Status Breakdown</h3>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Priority doughnut */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '1.75rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 12px rgba(0,49,53,0.05)' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: '500', color: '#003135', marginBottom: '1.5rem' }}>Priority Distribution</h3>
            <div style={{ maxWidth: '280px', margin: '0 auto' }}>
              <Doughnut data={priorityData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Bar chart — categories */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.75rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 12px rgba(0,49,53,0.05)', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: '500', color: '#003135', marginBottom: '1.5rem' }}>Issues by Category</h3>
          <Bar data={barData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
        </div>

        {/* Line chart — monthly trend */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.75rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 12px rgba(0,49,53,0.05)', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: '500', color: '#003135', marginBottom: '0.5rem' }}>Monthly Trend (Last 6 Months)</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#7A9A9C', marginBottom: '1.5rem' }}>Reported vs Resolved issues over time</p>
          {monthlyTrend.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7A9A9C', fontFamily: "'DM Sans', sans-serif" }}>Not enough data yet — submit more complaints to see trends</div>
          ) : (
            <Line data={lineData} options={chartOptions} />
          )}
        </div>

        {/* Category detail cards */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: '500', color: '#003135', marginBottom: '1.25rem' }}>Category Intelligence</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {categoryStats.map((cat) => {
              const percentage = overview.total > 0 ? Math.round((cat.count / overview.total) * 100) : 0
              return (
                <div key={cat._id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1.5px solid rgba(15,164,175,0.1)', boxShadow: '0 2px 12px rgba(0,49,53,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{categoryIcons[cat._id] || '📋'}</span>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: '700', color: '#003135', fontSize: '0.9rem', textTransform: 'capitalize' }}>{cat._id}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#7A9A9C' }}>{cat.count} issues · {percentage}% of total</div>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(15,164,175,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #0FA4AF, #AFDDE5)', borderRadius: '100px' }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}