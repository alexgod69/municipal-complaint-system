import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const dashboardPath =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'department' ? '/department' : '/dashboard'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center">
              <span className="text-accent-blue font-bold text-sm">MC</span>
            </div>
            <span className="font-semibold text-white hidden sm:block">MCMS</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/login" className="text-muted hover:text-white transition-colors text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            ) : (
              <>
                <Link to={dashboardPath} className="text-muted hover:text-white transition-colors text-sm">Dashboard</Link>
                {user.role === 'citizen' && (
                  <>
                    <Link to="/submit" className="text-muted hover:text-white transition-colors text-sm">Submit</Link>
                    <Link to="/track" className="text-muted hover:text-white transition-colors text-sm">Track</Link>
                  </>
                )}
                <button className="text-muted hover:text-white transition-colors">
                  <Bell size={18} />
                </button>
                <div className="flex items-center gap-3 pl-3 border-l border-border">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-muted capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="text-muted hover:text-red-400 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-muted" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg-secondary px-4 py-4 space-y-3">
          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block text-muted hover:text-white text-sm">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block btn-primary text-sm text-center">Get Started</Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} onClick={() => setOpen(false)} className="block text-muted hover:text-white text-sm">Dashboard</Link>
              {user.role === 'citizen' && (
                <>
                  <Link to="/submit" onClick={() => setOpen(false)} className="block text-muted hover:text-white text-sm">Submit Complaint</Link>
                  <Link to="/track" onClick={() => setOpen(false)} className="block text-muted hover:text-white text-sm">Track Complaint</Link>
                </>
              )}
              <button onClick={handleLogout} className="block text-red-400 text-sm">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
