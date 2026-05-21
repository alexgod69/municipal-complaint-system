import { Link } from 'react-router-dom'
import {
  Shield, Users, BarChart3, MapPin, Upload, Bell,
  Github, Globe, Database, Code2, Zap, CheckCircle2,
  ArrowRight, Building2, UserCheck, HeartHandshake
} from 'lucide-react'

const TECH = [
  { name: 'React + Vite', desc: 'Frontend UI', color: 'text-cyan-400' },
  { name: 'Node.js + Express', desc: 'Backend API', color: 'text-green-400' },
  { name: 'MongoDB Atlas', desc: 'Database', color: 'text-emerald-400' },
  { name: 'JWT Auth', desc: 'Security', color: 'text-yellow-400' },
  { name: 'Tailwind CSS', desc: 'Styling', color: 'text-sky-400' },
  { name: 'OpenStreetMap', desc: 'GPS & Maps', color: 'text-orange-400' },
  { name: 'Netlify', desc: 'Frontend Host', color: 'text-teal-400' },
  { name: 'Render', desc: 'Backend Host', color: 'text-purple-400' },
]

const ROLES = [
  {
    icon: HeartHandshake,
    title: 'Citizen',
    color: 'accent-green',
    borderColor: 'border-accent-green/30',
    bgColor: 'bg-accent-green/10',
    features: [
      'Register and log in securely',
      'Submit complaints with photo & GPS',
      'Track complaint status in real-time',
      'View full progress timeline',
    ],
  },
  {
    icon: Building2,
    title: 'Department Officer',
    color: 'accent-blue',
    borderColor: 'border-accent-blue/30',
    bgColor: 'bg-accent-blue/10',
    features: [
      'View complaints assigned to department',
      'Update status (In Progress / Resolved)',
      'Add internal remarks and notes',
      'Monitor workload and priority',
    ],
  },
  {
    icon: Shield,
    title: 'Admin',
    color: 'yellow-400',
    borderColor: 'border-yellow-400/30',
    bgColor: 'bg-yellow-400/10',
    features: [
      'Full visibility of all complaints',
      'Assign complaints to departments',
      'Manage users and roles',
      'Analytics dashboard & reports',
    ],
  },
]

const FEATURES = [
  { icon: MapPin,      title: 'GPS Location Detection', desc: 'Auto-detect location using browser GPS + OpenStreetMap reverse geocoding.' },
  { icon: Upload,      title: 'Photo Attachments',      desc: 'Citizens can attach photos to complaints for better context.' },
  { icon: BarChart3,   title: 'Analytics Dashboard',    desc: 'Admins see live stats — total, pending, resolved, avg resolution time.' },
  { icon: UserCheck,   title: 'Role-Based Access',      desc: 'Three roles: Citizen, Department Officer, Admin — each with their own views.' },
  { icon: Zap,         title: 'Real-Time Status',       desc: 'Complaint status updates instantly reflect across all dashboards.' },
  { icon: Shield,      title: 'JWT Authentication',     desc: 'Secure login with JSON Web Tokens stored safely in localStorage.' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-bg-primary pt-20">

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-4 py-1.5 text-accent-blue text-sm mb-6">
          <Code2 size={14} /> Open Source Project
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          Municipal Complaint<br />
          <span className="text-accent-blue">Management System</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
          A full-stack MERN web application that bridges the gap between citizens
          and their local government — making complaint filing transparent, trackable,
          and efficient.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="btn-primary flex items-center gap-2">
            Get Started <ArrowRight size={16} />
          </Link>
          <a
            href="https://github.com/alexgod69/municipal-complaint-system"
            target="_blank" rel="noopener noreferrer"
            className="btn-ghost flex items-center gap-2"
          >
            <Github size={16} /> View on GitHub
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-bg-secondary">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '3',    label: 'User Roles' },
            { value: '12',   label: 'Pages Built' },
            { value: '8',    label: 'REST API Routes' },
            { value: '100%', label: 'Free to Use' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-accent-blue">{s.value}</p>
              <p className="text-muted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — 3 roles */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Who Uses It?</h2>
        <p className="text-muted text-center mb-10">Three roles, each with a tailored experience</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {ROLES.map(role => (
            <div key={role.title} className={`glass-card p-6 border ${role.borderColor}`}>
              <div className={`w-10 h-10 rounded-lg ${role.bgColor} border ${role.borderColor} flex items-center justify-center mb-4`}>
                <role.icon size={20} className={`text-${role.color}`} />
              </div>
              <h3 className="font-semibold text-white text-lg mb-3">{role.title}</h3>
              <ul className="space-y-2">
                {role.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle2 size={14} className="text-accent-green mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-bg-secondary border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Key Features</h2>
          <p className="text-muted text-center mb-10">Everything built into one platform</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="glass-card p-5">
                <div className="w-9 h-9 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center mb-3">
                  <f.icon size={18} className="text-accent-blue" />
                </div>
                <h3 className="font-medium text-white mb-1">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Tech Stack</h2>
        <p className="text-muted text-center mb-10">Built entirely with free, open-source tools</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TECH.map(t => (
            <div key={t.name} className="glass-card p-4 text-center">
              <p className={`font-semibold ${t.color} text-sm`}>{t.name}</p>
              <p className="text-muted text-xs mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo credentials */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="glass-card p-8 border border-accent-blue/20">
          <h2 className="text-xl font-bold text-white mb-1 text-center">Try It Now</h2>
          <p className="text-muted text-sm text-center mb-6">Use these demo credentials to explore each role</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { role: 'Admin',      email: 'admin@mcms.com',     pass: 'Admin@123',  color: 'text-yellow-400' },
              { role: 'Department', email: 'roads@mcms.com',     pass: 'Roads@123',  color: 'text-accent-blue' },
              { role: 'Citizen',    email: 'rahul@example.com',  pass: 'Rahul@123',  color: 'text-accent-green' },
            ].map(c => (
              <div key={c.role} className="bg-bg-secondary rounded-lg p-4 border border-border">
                <p className={`font-semibold text-sm ${c.color} mb-2`}>{c.role}</p>
                <p className="text-xs text-muted font-mono">{c.email}</p>
                <p className="text-xs text-muted font-mono">{c.pass}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary text-center">Login Now</Link>
            <Link to="/register" className="btn-ghost text-center">Create Account</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-bg-secondary">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
          <p>© 2026 MCMS — Municipal Complaint Management System</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/alexgod69/municipal-complaint-system" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
              <Github size={14} /> GitHub
            </a>
            <a href="https://mcms-server.onrender.com/api/health" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
              <Database size={14} /> API Status
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
