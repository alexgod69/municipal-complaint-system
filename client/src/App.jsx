import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home           from './pages/Home'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import TrackComplaint  from './pages/TrackComplaint'
import ComplaintDetail from './pages/ComplaintDetail'
import AdminDashboard  from './pages/admin/AdminDashboard'
import ManageComplaints from './pages/admin/ManageComplaints'
import UserManagement  from './pages/admin/UserManagement'
import DeptDashboard   from './pages/department/DeptDashboard'
import About           from './pages/About'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/about"   element={<About />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen */}
        <Route path="/dashboard" element={<ProtectedRoute roles={['citizen']}><Dashboard /></ProtectedRoute>} />
        <Route path="/submit"    element={<ProtectedRoute roles={['citizen']}><SubmitComplaint /></ProtectedRoute>} />
        <Route path="/track"     element={<ProtectedRoute roles={['citizen']}><TrackComplaint /></ProtectedRoute>} />
        <Route path="/complaint/:id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute roles={['admin']}><ManageComplaints /></ProtectedRoute>} />
        <Route path="/admin/users"      element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />

        {/* Department */}
        <Route path="/department" element={<ProtectedRoute roles={['department']}><DeptDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
