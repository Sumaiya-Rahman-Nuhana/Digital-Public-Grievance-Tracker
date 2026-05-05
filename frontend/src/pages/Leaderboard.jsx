import { useEffect, useState } from "react";

const medals = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [data, setData] = useState({ mostResponsive: [], mostIgnored: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/leaderboard")
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500 text-lg">Loading leaderboard...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-center">
        🏆 Leaderboard
      </h1>
      <p className="text-gray-500 text-center mb-10">
        Departments ranked by complaint resolution performance
      </p>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          ✅ Most Responsive Departments
        </h2>
        {data.mostResponsive.length === 0 && (
          <p className="text-gray-400 text-center">No data yet</p>
        )}
        {data.mostResponsive.map((dept, i) => (
          <div key={i}
            className="flex items-center justify-between bg-green-50
            border border-green-200 rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{medals[i]}</span>
              <div>
                <p className="font-semibold text-gray-800">{dept.name}</p>
                <p className="text-sm text-gray-400">
                  {dept.totalComplaints} complaints handled
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {dept.resolutionRate}%
              </p>
              <p className="text-xs text-gray-400">resolved</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-red-700 mb-4">
          ⚠️ Most Ignored Departments
        </h2>
        {data.mostIgnored.length === 0 && (
          <p className="text-gray-400 text-center">No data yet</p>
        )}
        {data.mostIgnored.map((dept, i) => (
          <div key={i}
            className="flex items-center justify-between bg-red-50
            border border-red-200 rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-semibold text-gray-800">{dept.name}</p>
                <p className="text-sm text-gray-400">
                  {dept.totalComplaints} complaints
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-500">
                {dept.resolutionRate}%
              </p>
              <p className="text-xs text-gray-400">resolved</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}