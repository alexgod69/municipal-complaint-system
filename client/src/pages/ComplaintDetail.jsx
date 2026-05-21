import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { complaintAPI, getMediaUrl } from '../api'
import StatusBadge from '../components/StatusBadge'
import toast from 'react-hot-toast'
import { ArrowLeft, MapPin, Calendar, Tag, MessageSquare, User } from 'lucide-react'

export default function ComplaintDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    complaintAPI.getById(id)
      .then(res => setComplaint(res.data))
      .catch(() => { toast.error('Complaint not found'); navigate(-1) })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!complaint) return null

  const timeline = [
    { status: 'Submitted',   date: complaint.createdAt, done: true },
    { status: 'Assigned',    date: complaint.assignedAt, done: !!complaint.department },
    { status: 'In Progress', date: complaint.inProgressAt, done: ['inprogress','resolved','closed'].includes(complaint.status) },
    { status: 'Resolved',    date: complaint.resolvedAt, done: ['resolved','closed'].includes(complaint.status) },
  ]

  return (
    <div className="min-h-screen bg-bg-primary pt-20 px-4">
      <div className="max-w-3xl mx-auto py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="glass-card p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-muted font-mono mb-1">#{complaint.complaintId}</p>
              <h1 className="text-xl font-bold text-white">{complaint.category}</h1>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          <p className="text-muted text-sm leading-relaxed mb-6">{complaint.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted border-t border-border pt-4">
            {complaint.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {complaint.coordinates
                  ? <a
                      href={`https://www.openstreetmap.org/?mlat=${complaint.coordinates.lat}&mlon=${complaint.coordinates.lng}&zoom=16`}
                      target="_blank" rel="noopener noreferrer"
                      className="hover:text-accent-blue transition-colors"
                    >
                      {complaint.location}
                    </a>
                  : complaint.location
                }
              </span>
            )}
            {complaint.coordinates && (
              <span className="flex items-center gap-1 text-xs font-mono text-accent-green/70">
                {complaint.coordinates.lat.toFixed(5)}, {complaint.coordinates.lng.toFixed(5)}
              </span>
            )}
            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(complaint.createdAt).toLocaleDateString()}</span>
            {complaint.department && <span className="flex items-center gap-1"><Tag size={14} />{complaint.department.name}</span>}
          </div>

          {complaint.imageUrl && (
            <img src={getMediaUrl(complaint.imageUrl)} alt="complaint" className="mt-4 rounded-lg max-h-64 object-cover border border-border" />
          )}
        </div>

        {/* Timeline */}
        <div className="glass-card p-6 mb-4">
          <h2 className="font-semibold text-white mb-6">Progress Timeline</h2>
          <div className="space-y-4">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${step.done ? 'bg-accent-green' : 'bg-border'}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${step.done ? 'text-white' : 'text-muted'}`}>{step.status}</p>
                  {step.date && <p className="text-xs text-muted">{new Date(step.date).toLocaleString()}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remarks */}
        {complaint.remarks?.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare size={16} /> Department Remarks
            </h2>
            <div className="space-y-3">
              {complaint.remarks.map((r, i) => (
                <div key={i} className="bg-bg-secondary rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-muted" />
                    <span className="text-sm text-muted">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-white">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
