import { useEffect, useState } from 'react'
import { userAPI } from '../../api'
import toast from 'react-hot-toast'
import { Search, Trash2, Shield } from 'lucide-react'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    userAPI.getAll()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await userAPI.delete(id)
      toast.success('User deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const roleColor = { admin: 'text-red-400', department: 'text-purple-400', citizen: 'text-blue-400' }

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
        <p className="text-muted text-sm mb-8">Manage registered users and roles</p>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input-field pl-9 max-w-md" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-muted font-medium py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} className="border-b border-border/50 hover:bg-bg-hover transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{u.name}</td>
                    <td className="py-3 px-4 text-muted">{u.email}</td>
                    <td className="py-3 px-4 text-muted">{u.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center gap-1 text-xs font-medium ${roleColor[u.role] || 'text-muted'}`}>
                        <Shield size={12} /> {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-muted py-12">No users found.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
