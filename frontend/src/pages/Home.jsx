import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const stats = [
  { label: 'Issues Reported', value: '2,847' },
  { label: 'Issues Resolved', value: '1,923' },
  { label: 'Active Citizens', value: '5,210' },
  { label: 'Avg Resolution', value: '4.2 days' },
]

const categories = [
  { icon: '🛣️', name: 'Roads', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { icon: '💧', name: 'Water', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { icon: '⚡', name: 'Electricity', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { icon: '🏥', name: 'Healthcare', color: 'bg-red-50 text-red-600 border-red-200' },
  { icon: '🎓', name: 'Education', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { icon: '🚰', name: 'Drainage', color: 'bg-teal-50 text-teal-600 border-teal-200' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-blue-500 bg-opacity-40 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
            Civic Issue Reporting Platform
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Report. Track. <br />
            <span className="text-blue-200">Resolve Together.</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            A transparent platform for citizens to report local problems and track their resolution in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/submit" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                Report an Issue
              </Link>
            ) : (
              <Link to="/register" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                Get Started Free
              </Link>
            )}
            <Link to="/feed" className="border border-white border-opacity-50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors">
              View Public Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Report Any Civic Issue</h2>
          <p className="text-gray-500 text-lg">From roads to education — every issue matters</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link to="/submit" key={cat.name} className={`border rounded-xl p-4 text-center hover:shadow-md transition-all cursor-pointer ${cat.color}`}>
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-semibold">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Three simple steps to civic action</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Report the Issue', desc: 'Submit your complaint with photos, location, and details. Takes less than 2 minutes.', icon: '📝' },
              { step: '02', title: 'Track Progress', desc: 'Get a unique tracking ID and follow your complaint from submission to resolution.', icon: '📍' },
              { step: '03', title: 'See Resolution', desc: 'Authorities respond and resolve issues. Rate the resolution and provide feedback.', icon: '✅' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Step {item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of citizens actively improving their communities.</p>
          <Link to={user ? "/submit" : "/register"} className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg inline-block">
            {user ? 'Report an Issue Now' : 'Create Free Account'}
          </Link>
        </div>
      </section>
    </div>
  )
}