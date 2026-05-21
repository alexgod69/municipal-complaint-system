import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { MapPin, Calendar, Tag } from 'lucide-react'

export default function ComplaintCard({ complaint }) {
  return (
    <div className="glass-card p-5 hover:border-accent-blue/30 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs text-muted font-mono mb-1">#{complaint.complaintId}</p>
          <h3 className="font-medium text-white group-hover:text-accent-blue transition-colors line-clamp-1">
            {complaint.description?.slice(0, 60)}...
          </h3>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted mt-3">
        <span className="flex items-center gap-1">
          <Tag size={12} />
          {complaint.category}
        </span>
        {complaint.location && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {complaint.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(complaint.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted">
          {complaint.department?.name || 'Unassigned'}
        </span>
        <Link
          to={`/complaint/${complaint._id}`}
          className="text-xs text-accent-blue hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
