import { useEffect, useState } from 'react'
import { complaintAPI, departmentAPI } from '../../api'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, RefreshCw, Trash2, UserCheck, Eye } from 'lucide-react'

const STATUSES = ['all', 'pending', 'open', 'assigned', 'inprogress', 'resolved', 'closed']

export default function ManageComplaints() {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assignModal, setAssignModal] = useState(null)
  const [assignDept, setAssignDept] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      complaintAPI.getAll({ status: statusFilter !== 'all' ? statusFilter : undefined }),
      departmentAPI.getAll(),
    ]).then(([c, d]) => {
      setComplaints(c.data.complaints || c.data)
      setDepartments(d.data)
    }).catch(() => toast.error('Failed to load'))
    .finally(() => setLoading(false))
  }

  useEffect(load, [statusFilter])

  const handleAssign = async () => {
    if (!assignDept) return toast.error('Select a department')
    try {
      await complaintAPI.assign(assignModal._id, { departmentId: assignDept })
      toast.success('Complaint assigned!')
      setAssignModal(null)
      load()
    } catch { toast.error('Assignment failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return
    try {
      await complaintAPI.delete(id)
      toast.success('Deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const filtered = complaints.filter(c =>
    c.complaintId?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Manage Complaints</h1>
          <button onClick={load} className="btn-ghost flex items-center gap-2 text-sm">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input-field pl-9" placeholder="Search by ID, category, user..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input-field sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-secondary">
                    {['ID', 'Category', 'Description', 'User', 'Dept', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left text-muted font-medium py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c._id} className="border-b border-border/50 hover:bg-bg-hover transition-colors">
                      <td className="py-3 px-4 font-mono text-accent-blue text-xs cursor-pointer hover:underline" onClick={() => navigate(`/complaint/${c._id}`)}>#{c.complaintId}</td>
                      <td className="py-3 px-4 text-white">{c.category}</td>
                      <td className="py-3 px-4 text-muted max-w-xs truncate">{c.description ? c.description.slice(0, 60) + (c.description.length > 60 ? '…' : '') : '—'}</td>
                      <td className="py-3 px-4 text-muted">{c.user?.name || c.user?.email || '—'}</td>
                      <td className="py-3 px-4 text-muted">{c.department?.name || <span className="text-yellow-500">Unassigned</span>}</td>
                      <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                      <td className="py-3 px-4 text-muted text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/complaint/${c._id}`)}
                            className="text-accent-green hover:text-green-400 transition-colors" title="View Details">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => { setAssignModal(c); setAssignDept(c.department?._id || '') }}
                            className="text-accent-blue hover:text-blue-400 transition-colors" title="Assign">
                            <UserCheck size={14} />
                          </button>
                          <button onClick={() => handleDelete(c._id)}
                            className="text-red-500 hover:text-red-400 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-center text-muted py-12">No complaints found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass-card p-6 w-full max-w-md">
            <h2 className="font-semibold text-white mb-1">Assign Complaint</h2>
            <p className="text-muted text-sm mb-4">#{assignModal.complaintId} — {assignModal.category}</p>
            <select className="input-field mb-4" value={assignDept} onChange={e => setAssignDept(e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={handleAssign} className="btn-primary flex-1">Assign</button>
              <button onClick={() => setAssignModal(null)} className="btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
