import { useEffect, useState } from 'react'
import { complaintAPI } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'
import { CheckCircle, Clock, MessageSquare, RefreshCw } from 'lucide-react'
import StatCard from '../../components/StatCard'

const STATUS_OPTIONS = ['open', 'assigned', 'inprogress', 'resolved', 'closed']

export default function DeptDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [remark, setRemark] = useState('')
  const [newStatus, setNewStatus] = useState('')

  const load = () => {
    setLoading(true)
    complaintAPI.getAll({ assigned: true })
      .then(res => setComplaints(res.data.complaints || res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleUpdateStatus = async (id) => {
    if (!newStatus) return toast.error('Select a status')
    try {
      await complaintAPI.update(id, { status: newStatus })
      toast.success('Status updated')
      load()
      setSelected(null)
    } catch { toast.error('Update failed') }
  }

  const handleRemark = async (id) => {
    if (!remark.trim()) return toast.error('Enter a remark')
    try {
      await complaintAPI.addRemark(id, { text: remark })
      toast.success('Remark added')
      setRemark('')
      load()
    } catch { toast.error('Failed to add remark') }
  }

  const stats = {
    total:     complaints.length,
    resolved:  complaints.filter(c => c.status === 'resolved').length,
    pending:   complaints.filter(c => ['assigned', 'open'].includes(c.status)).length,
    active:    complaints.filter(c => c.status === 'inprogress').length,
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Department Dashboard</h1>
            <p className="text-muted text-sm mt-1">Manage assigned complaints</p>
          </div>
          <button onClick={load} className="btn-ghost flex items-center gap-2 text-sm">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Clock}        label="Assigned"  value={stats.total}    color="blue" />
          <StatCard icon={CheckCircle}  label="Resolved"  value={stats.resolved} color="green" />
          <StatCard icon={Clock}        label="Pending"   value={stats.pending}  color="orange" />
          <StatCard icon={MessageSquare}label="Active"    value={stats.active}   color="purple" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map(c => (
              <div key={c._id} className="glass-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-accent-blue">#{c.complaintId}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="font-medium text-white">{c.category}</p>
                    <p className="text-sm text-muted mt-1 line-clamp-2">{c.description}</p>
                    {c.location && <p className="text-xs text-muted mt-1">📍 {c.location}</p>}
                  </div>
                  <button
                    onClick={() => setSelected(selected?._id === c._id ? null : c)}
                    className="text-sm text-accent-blue hover:underline flex-shrink-0"
                  >
                    {selected?._id === c._id ? 'Close' : 'Update'}
                  </button>
                </div>

                {selected?._id === c._id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div className="flex gap-3">
                      <select className="input-field flex-1" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                        <option value="">Update Status</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                      <button onClick={() => handleUpdateStatus(c._id)} className="btn-primary text-sm px-4">Save</button>
                    </div>
                    <div className="flex gap-3">
                      <input
                        className="input-field flex-1"
                        placeholder="Add a remark or update..."
                        value={remark}
                        onChange={e => setRemark(e.target.value)}
                      />
                      <button onClick={() => handleRemark(c._id)} className="btn-ghost text-sm px-4">Add</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {complaints.length === 0 && (
              <div className="glass-card p-12 text-center text-muted">No complaints assigned to your department.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
