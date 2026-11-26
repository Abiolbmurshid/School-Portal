
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  LogOut,
  LayoutDashboard,
  UserRound,
  Home
} from 'lucide-react'
import Brand from '../components/Brand.jsx'
import Notice from '../components/Notice.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      if (!isSupabaseConfigured) {
        setError('Supabase is not configured.')
        setBusy(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        navigate('/student-login')
        return
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!active) return

      if (profileError) {
        setError(profileError.message)
      } else {
        setProfile(data)
      }

      setBusy(false)
    }

    load()

    return () => {
      active = false
    }
  }, [navigate])

  async function logout() {
    await supabase.auth.signOut()
    navigate('/student-login')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <Brand light />

        <div className="side-label">STUDENT MENU</div>

        <Link className="side-link active" to="/student-dashboard">
          <LayoutDashboard size={18} />
          Overview
        </Link>

        <span className="side-link side-muted">
          <UserRound size={18} />
          My profile
        </span>

        <span className="side-link side-muted">
          <BookOpen size={18} />
          Academics
        </span>

        <span className="side-link side-muted">
          <CalendarDays size={18} />
          Schedule
        </span>

        <button className="side-logout" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <main className="dashboard-main">

        <div className="dash-top">
          <div>
            <span className="eyebrow">STUDENT PORTAL</span>
            <h1>Dashboard</h1>
          </div>

          <div className="dash-actions">
            <Link to="/" className="dashboard-home-link">
              <Home size={17} />
              Back to Home
            </Link>

            <span className="user-pill">
              <span className="avatar">
                {profile?.first_name?.[0] || 'S'}
              </span>
              Student
            </span>
          </div>
        </div>

        {busy ? (
          <p className="muted">Loading your dashboard…</p>
        ) : (
          <>
            <Notice>{error}</Notice>

            <section className="welcome-panel">
              <div>
                <span className="eyebrow">YOUR LEARNING JOURNEY</span>
                <h2>Welcome, {profile?.first_name || 'Student'}!</h2>
                <p>
                  Your student portal is ready. Your school information
                  will appear here.
                </p>
              </div>

              <div className="welcome-symbol">
                <BookOpen size={42} />
              </div>
            </section>

            <div className="dash-grid">
              <article className="dash-card">
                <span className="dash-card-icon">
                  <UserRound />
                </span>
                <span className="muted">Student name</span>
                <strong>
                  {profile
                    ? `${profile.first_name} ${profile.last_name}`.trim()
                    : '—'}
                </strong>
              </article>

              <article className="dash-card">
                <span className="dash-card-icon">
                  <BookOpen />
                </span>
                <span className="muted">Class / Level</span>
                <strong>{profile?.class_name || 'Not assigned'}</strong>
              </article>

              <article className="dash-card">
                <span className="dash-card-icon">
                  <CalendarDays />
                </span>
                <span className="muted">Account status</span>
                <strong>Active session</strong>
              </article>
            </div>

            <section className="content-panel">
              <h3>Student information</h3>

              <div className="info-row">
                <span>Email address</span>
                <strong>{profile?.email || '—'}</strong>
              </div>

              <div className="info-row">
                <span>Phone number</span>
                <strong>{profile?.phone || 'Not provided'}</strong>
              </div>

              <div className="info-row">
                <span>Class / Level</span>
                <strong>{profile?.class_name || 'Not assigned'}</strong>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
