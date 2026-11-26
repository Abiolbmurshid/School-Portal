
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  LogOut,
  ShieldCheck,
  Users,
  UserCheck,
  UserPlus,
  BookOpen,
  Search,
  CalendarDays,
  Activity,
  ArrowUpRight,
  Clock,
  RefreshCw,
  Menu,
  X,
  LayoutDashboard,
  Home
} from 'lucide-react'

import Brand from '../components/Brand.jsx'
import Notice from '../components/Notice.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [students, setStudents] = useState([])
  const [adminEmail, setAdminEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(true)
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  async function loadDashboard() {
    setBusy(true)
    setError('')

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured.')
      setBusy(false)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      navigate('/admin-login')
      return
    }

    setAdminEmail(session.user.email || '')

    const { data: profile, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (roleError || profile?.role !== 'admin') {
      await supabase.auth.signOut()
      navigate('/admin-login')
      return
    }

    const { data, error: listError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, class_name, created_at')
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (listError) {
      setError(listError.message)
    } else {
      setStudents(data || [])
    }

    setBusy(false)
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    navigate('/admin-login')
  }

  const stats = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const newStudents = students.filter(student =>
      student.created_at &&
      new Date(student.created_at) >= thirtyDaysAgo
    )

    const classes = new Set(
      students
        .map(student => student.class_name?.trim())
        .filter(Boolean)
    )

    return {
      total: students.length,
      active: students.length,
      newStudents: newStudents.length,
      classes: classes.size
    }
  }, [students])

  const filteredStudents = students.filter(student => {
    const fullName =
      `${student.first_name} ${student.last_name}`.toLowerCase()

    return (
      fullName.includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.class_name?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const recentStudents = students.slice(0, 5)

  return (
    <div className="premium-admin">

      <aside className={`premium-sidebar ${mobileMenu ? 'mobile-open' : ''}`}>
        <div className="premium-brand">
          <Brand light />
          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-profile">
          <div className="admin-profile-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <strong>Administrator</strong>
            <span>School Management</span>
          </div>
        </div>

        <span className="premium-nav-label">MAIN MENU</span>

        <nav className="premium-nav">
          <a href="#overview" className="premium-nav-item selected">
            <LayoutDashboard size={18} />
            Overview
          </a>

          <a href="#students" className="premium-nav-item">
            <Users size={18} />
            Student Management
          </a>

          <a href="#attendance" className="premium-nav-item">
            <CalendarDays size={18} />
            Attendance
          </a>

          <a href="#activities" className="premium-nav-item">
            <Activity size={18} />
            Recent Activities
          </a>
        </nav>

        <span className="premium-nav-label">ACADEMIC</span>

        <nav className="premium-nav">
          <a href="#classes" className="premium-nav-item">
            <BookOpen size={18} />
            Classes
          </a>
        </nav>

        <div className="premium-sidebar-bottom">
          <div className="sidebar-help">
            <GraduationCap size={25} />
            <strong>School Administration</strong>
            <span>Manage your school from one place.</span>
          </div>

          <button className="premium-logout" onClick={logout}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="premium-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="premium-main" id="overview">

        <header className="premium-topbar">
          <div className="premium-top-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="premium-breadcrumb">
                ADMINISTRATION / OVERVIEW
              </span>
              <h1>Dashboard Overview</h1>
            </div>
          </div>

          <div className="premium-top-right">

            <Link to="/" className="admin-home-link">
              <Home size={17} />
              Back to Home
            </Link>

            <div className="premium-date">
              <CalendarDays size={16} />
              {new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>

            <button
              className="premium-refresh"
              onClick={loadDashboard}
              title="Refresh dashboard"
            >
              <RefreshCw size={17} />
            </button>

            <div className="premium-admin-avatar">
              <ShieldCheck size={19} />
            </div>
          </div>
        </header>

        <section className="premium-welcome">
          <div>
            <span>WELCOME TO YOUR ADMINISTRATION PORTAL</span>
            <h2>Good day, Administrator.</h2>
            <p>
              Here's an overview of your school's student records
              and activities.
            </p>
            <small>{adminEmail}</small>
          </div>

          <div className="premium-welcome-icon">
            <GraduationCap size={75} />
          </div>
        </section>

        {error && <Notice>{error}</Notice>}

        <section className="premium-section-heading">
          <div>
            <span className="premium-breadcrumb">SCHOOL STATISTICS</span>
            <h2>Institution Overview</h2>
          </div>
          <span className="premium-live">
            <span /> Live database
          </span>
        </section>

        <section className="premium-stats">

          <div className="premium-stat-card">
            <div className="premium-stat-top">
              <span>Total Students</span>
              <div className="stat-icon blue">
                <Users size={21} />
              </div>
            </div>
            <strong>{busy ? '—' : stats.total}</strong>
            <small>Registered student accounts</small>
            <a href="#students">
              View students <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="premium-stat-card">
            <div className="premium-stat-top">
              <span>Active Students</span>
              <div className="stat-icon green">
                <UserCheck size={21} />
              </div>
            </div>
            <strong>{busy ? '—' : stats.active}</strong>
            <small>Registered student profiles</small>
            <a href="#students">
              View records <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="premium-stat-card">
            <div className="premium-stat-top">
              <span>New Registrations</span>
              <div className="stat-icon gold">
                <UserPlus size={21} />
              </div>
            </div>
            <strong>{busy ? '—' : stats.newStudents}</strong>
            <small>Registrations in the last 30 days</small>
            <a href="#activities">
              View registrations <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="premium-stat-card" id="classes">
            <div className="premium-stat-top">
              <span>Total Classes</span>
              <div className="stat-icon purple">
                <BookOpen size={21} />
              </div>
            </div>
            <strong>{busy ? '—' : stats.classes}</strong>
            <small>Classes represented in student records</small>
            <a href="#students">
              View records <ArrowUpRight size={14} />
            </a>
          </div>

        </section>

        <section className="premium-middle-grid">

          <div className="premium-panel" id="attendance">
            <div className="premium-panel-heading">
              <div>
                <span className="premium-breadcrumb">STUDENT MONITORING</span>
                <h3>Attendance Overview</h3>
              </div>
              <CalendarDays size={21} />
            </div>

            <div className="premium-empty-module">
              <div className="premium-module-icon">
                <CalendarDays size={28} />
              </div>
              <strong>Attendance management</strong>
              <p>
                Attendance statistics will appear here once
                the school's attendance records are configured.
              </p>
              <span>Attendance module not yet connected</span>
            </div>
          </div>

          <div className="premium-panel" id="activities">
            <div className="premium-panel-heading">
              <div>
                <span className="premium-breadcrumb">LATEST UPDATES</span>
                <h3>Recent Registrations</h3>
              </div>
              <Clock size={21} />
            </div>

            {busy ? (
              <p className="muted">Loading registrations...</p>
            ) : recentStudents.length === 0 ? (
              <p className="empty-state">No recent registrations.</p>
            ) : (
              <div className="premium-activity-list">
                {recentStudents.map(student => (
                  <div className="premium-activity" key={student.id}>
                    <div className="activity-avatar">
                      <UserPlus size={17} />
                    </div>
                    <div>
                      <strong>
                        {`${student.first_name} ${student.last_name}`.trim() || 'Student'}
                      </strong>
                      <span>New student registration</span>
                    </div>
                    <small>
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : 'Recently'}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

        <section className="premium-panel premium-student-panel" id="students">
          <div className="premium-student-heading">
            <div>
              <span className="premium-breadcrumb">STUDENT RECORDS</span>
              <h3>Student Management</h3>
              <p>View and search registered student accounts.</p>
            </div>

            <div className="premium-student-count">
              <Users size={16} />
              {students.length} Students
            </div>
          </div>

          <div className="premium-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search by student name, email or class..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>

          {busy ? (
            <p className="muted">Loading student records...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="empty-state">
              No matching student records found.
            </p>
          ) : (
            <div className="table-wrap">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Class / Level</th>
                    <th>Date Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="premium-student-name">
                          <div>
                            {(student.first_name?.[0] || 'S').toUpperCase()}
                          </div>
                          <strong>
                            {`${student.first_name} ${student.last_name}`.trim() || 'Student'}
                          </strong>
                        </div>
                      </td>
                      <td>{student.email}</td>
                      <td>{student.phone || '—'}</td>
                      <td>{student.class_name || 'Not assigned'}</td>
                      <td>
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

        <footer className="premium-footer">
          <span>School Administration Portal</span>
          <span>Administrator: {adminEmail}</span>
        </footer>

      </main>
    </div>
  )
}
