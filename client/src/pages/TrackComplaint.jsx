import { useEffect, useState } from 'react'
import { complaintAPI } from '../api'
import ComplaintCard from '../components/ComplaintCard'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { Search, Filter } from 'lucide-react'

const STATUSES = ['all', 'pending', 'open', 'assigned', 'inprogress', 'resolved', 'closed']

export default function TrackComplaint() {
  const [complaints, setComplaints] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintAPI.getMine()
      .then(res => { setComplaints(res.data); setFiltered(res.data) })
      .catch(() => toast.error('Could not load complaints'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = complaints
    if (status !== 'all') result = result.filter(c => c.status === status)
    if (search) result = result.filter(c =>
      c.complaintId?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, status, complaints])

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Track Complaints</h1>
          <p className="text-muted text-sm mt-1">Monitor the status of all your filed complaints</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="input-field pl-9"
              placeholder="Search by ID, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <select className="input-field pl-9 pr-4 sm:w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-muted">
            No complaints found matching your filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => <ComplaintCard key={c._id} complaint={c} />)}
          </div>
        )}
      </div>
    </div>
  )
}
