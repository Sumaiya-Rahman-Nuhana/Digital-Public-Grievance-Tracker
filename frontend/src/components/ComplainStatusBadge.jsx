const statusColors = {
  'Reported':     'bg-blue-100 text-blue-800 border-blue-300',
  'Acknowledged': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'In Progress':  'bg-orange-100 text-orange-800 border-orange-300',
  'Resolved':     'bg-green-100 text-green-800 border-green-300',
  'Overdue':      'bg-red-100 text-red-800 border-red-300',
  'Ignored':      'bg-gray-100 text-gray-600 border-gray-300',
};

export default function ComplaintStatusBadge({ status }) {
  const color = statusColors[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${color}`}>
      {status}
    </span>
  );
}