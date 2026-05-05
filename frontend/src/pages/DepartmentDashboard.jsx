import { useEffect, useState } from "react";

export default function DepartmentDashboard() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments")
      .then(res => res.json())
      .then(data => { setDepartments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500 text-lg">Loading departments...</p>
    </div>
  );

  if (departments.length === 0) return (
    <div className="text-center p-10 text-gray-400">
      No department data yet.
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        🏛️ Department Performance
      </h1>
      <p className="text-gray-500 mb-8">
        Live stats on how each department handles complaints
      </p>

      <div className="grid gap-5">
        {departments.map(dept => {
          const rate = dept.totalComplaints > 0
            ? ((dept.resolvedComplaints / dept.totalComplaints) * 100).toFixed(1)
            : 0;

          return (
            <div key={dept._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {dept.name}
              </h2>

              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-blue-600">
                    {dept.totalComplaints}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Complaints</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-green-600">
                    {dept.resolvedComplaints}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Resolved</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-2xl font-bold text-purple-600">
                    {rate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Resolution Rate</p>
                </div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${rate}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Avg resolution time: {dept.avgResolutionTime} hours
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}