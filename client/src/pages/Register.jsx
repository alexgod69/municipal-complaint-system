import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api'
import toast from 'react-hot-toast'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data.user, res.data.token)
      toast.success('Account created! Welcome to MCMS.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mx-auto mb-4">
            <UserPlus size={20} className="text-accent-green" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-muted text-sm mt-2">Join MCMS and make your voice heard</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-2">Full Name</label>
              <input type="text" className="input-field" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Phone Number</label>
              <input type="tel" className="input-field" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} className="input-field pr-10" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
