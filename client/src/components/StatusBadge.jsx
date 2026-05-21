export default function StatusBadge({ status }) {
  const map = {
    pending:    'status-pending',
    open:       'status-open',
    assigned:   'status-assigned',
    inprogress: 'status-inprogress',
    resolved:   'status-resolved',
    closed:     'status-closed',
  }
  const cls = map[status?.toLowerCase()] || 'status-pending'
  return (
    <span className={`${cls} text-xs font-medium px-2.5 py-1 rounded-full capitalize`}>
      {status === 'inprogress' ? 'In Progress' : status}
    </span>
  )
}
