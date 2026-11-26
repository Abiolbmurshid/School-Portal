import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import StudentRegister from './pages/StudentRegister.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<StudentRegister />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}