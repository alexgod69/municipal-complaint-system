import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyticsAPI, complaintAPI } from '../../api'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ClipboardList, CheckCircle, Clock, AlertCircle, Users, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#4f8ef7', '#22d3a0', '#f97316', '#a78bfa', '#ef4444']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([analyticsAPI.getStats(), complaintAPI.getAll({ limit: 8 })])
      .then(([s, c]) => { setStats(s.data); setRecent(c.data.complaints || c.data) })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center pt-16">
      <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const categoryData = stats?.byCategory?.map(c => ({ name: c._id?.slice(0, 10), count: c.count })) || []
  const statusData   = stats?.byStatus?.map(s => ({ name: s._id, value: s.count })) || []

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted text-sm mt-1">Complaint management overview</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/complaints" className="btn-primary text-sm">Manage Complaints</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ClipboardList} label="Total Complaints" value={stats?.total}    color="blue" />
          <StatCard icon={CheckCircle}   label="Resolved"         value={stats?.resolved} color="green" />
          <StatCard icon={Clock}         label="Pending"          value={stats?.pending}  color="orange" />
          <StatCard icon={Users}         label="Total Users"      value={stats?.users}    color="purple" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-6">Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fill: '#8888aa', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8888aa', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a1a2a', border: '1px solid #2a2a3e', borderRadius: 8 }} />
                <Bar dataKey="count" fill="#4f8ef7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-6">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2a', border: '1px solid #2a2a3e', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Complaints</h3>
            <Link to="/admin/complaints" className="text-sm text-accent-blue hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Category', 'User', 'Location', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-muted font-medium py-3 px-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c._id} className="border-b border-border/50 hover:bg-bg-hover transition-colors">
                    <td className="py-3 px-2 font-mono text-accent-blue text-xs">#{c.complaintId}</td>
                    <td className="py-3 px-2 text-white">{c.category}</td>
                    <td className="py-3 px-2 text-muted">{c.user?.name || '—'}</td>
                    <td className="py-3 px-2 text-muted">{c.location || '—'}</td>
                    <td className="py-3 px-2"><StatusBadge status={c.status} /></td>
                    <td className="py-3 px-2 text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
