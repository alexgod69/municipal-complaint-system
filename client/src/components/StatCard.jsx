export default function StatCard({ icon: Icon, label, value, color = 'blue', trend }) {
  const colors = {
    blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green:  'text-green-400 bg-green-500/10 border-green-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    red:    'text-red-400 bg-red-500/10 border-red-500/20',
  }
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value ?? '–'}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '+' : ''}{trend}% this month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colors[color]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  )
}
