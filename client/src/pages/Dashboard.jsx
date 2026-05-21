import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { complaintAPI } from '../api'
import ComplaintCard from '../components/ComplaintCard'
import StatCard from '../components/StatCard'
import { Plus, ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintAPI.getMine()
      .then(res => setComplaints(res.data))
      .catch(() => toast.error('Could not load complaints'))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total:    complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    pending:  complaints.filter(c => ['pending', 'open', 'assigned'].includes(c.status)).length,
    urgent:   complaints.filter(c => c.status === 'inprogress').length,
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Hello, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-muted text-sm mt-1">Track and manage your complaints</p>
          </div>
          <Link to="/submit" className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Complaint
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ClipboardList} label="Total Filed"    value={stats.total}    color="blue" />
          <StatCard icon={CheckCircle}  label="Resolved"        value={stats.resolved} color="green" />
          <StatCard icon={Clock}        label="In Progress"     value={stats.pending}  color="orange" />
          <StatCard icon={AlertCircle}  label="Active"          value={stats.urgent}   color="purple" />
        </div>

        {/* Complaints */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">My Complaints</h2>
          <Link to="/track" className="text-sm text-accent-blue hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <ClipboardList size={40} className="text-muted mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No complaints yet</p>
            <p className="text-muted text-sm mb-6">File your first complaint to get started</p>
            <Link to="/submit" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> File a Complaint
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.slice(0, 6).map(c => <ComplaintCard key={c._id} complaint={c} />)}
          </div>
        )}
      </div>
    </div>
  )
}
