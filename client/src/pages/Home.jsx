import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, BarChart3, Users, CheckCircle } from 'lucide-react'

const categories = [
  'Garbage Collection', 'Road Repair', 'Water Supply',
  'Drainage Issues', 'Street Lights', 'Illegal Construction',
  'Pollution', 'Public Toilet',
]

const features = [
  { icon: Zap,       color: 'text-yellow-400', title: 'Fast Resolution',    desc: 'Complaints routed to the right department instantly.' },
  { icon: BarChart3, color: 'text-blue-400',   title: 'Real-time Tracking', desc: 'Follow your complaint from submission to resolution.' },
  { icon: Shield,    color: 'text-green-400',  title: 'Secure & Private',   desc: 'JWT auth, hashed passwords, role-based access.' },
  { icon: Users,     color: 'text-purple-400', title: 'Multi-Role Access',  desc: 'Citizens, staff, departments, and admins.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            Municipal Complaint Management System
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Your City, Your Voice.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-green">
              We Listen.
            </span>
          </h1>

          <p className="text-muted text-lg max-w-2xl mx-auto mb-10">
            File, track, and resolve municipal complaints online. Faster response,
            full transparency, and a cleaner city for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
              File a Complaint <ArrowRight size={16} />
            </Link>
            <Link to="/track" className="btn-ghost flex items-center justify-center gap-2">
              Track Status
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="glass-card p-6">
              <Icon size={24} className={`${color} mb-4`} />
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-muted text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-white text-center mb-3">Complaint Categories</h2>
        <p className="text-muted text-center mb-10">We handle all major municipal issues</p>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-bg-card border border-border text-sm text-muted px-4 py-2 rounded-full hover:border-accent-blue/40 hover:text-white transition-colors cursor-default"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Register',       desc: 'Create your free account.' },
            { step: '02', title: 'File Complaint',  desc: 'Describe the issue with photos.' },
            { step: '03', title: 'We Act',          desc: 'Routed to the right department.' },
            { step: '04', title: 'Resolved',        desc: 'Get notified on resolution.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-accent-blue font-bold text-sm">{step}</span>
              </div>
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-muted text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-32 text-center">
        <div className="glass-card p-10">
          <CheckCircle size={40} className="text-accent-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Ready to make your city better?</h2>
          <p className="text-muted mb-6">Join thousands of citizens already using MCMS.</p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-muted text-sm">
        © 2026 Municipal Complaint Management System. Built with MERN + Django.
      </footer>
    </div>
  )
}
