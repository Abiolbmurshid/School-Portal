
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Home
} from 'lucide-react'

import Brand from '../components/Brand.jsx'
import Field from '../components/Field.jsx'
import Notice from '../components/Notice.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')

    if (!isSupabaseConfigured) {
      return setError('Supabase is not configured yet.')
    }

    setBusy(true)

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

    if (loginError) {
      setBusy(false)
      return setError(loginError.message)
    }

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

    if (profileError || profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setBusy(false)

      return setError(
        'This account does not have administrator access. Ask the project owner to assign the admin role.'
      )
    }

    setBusy(false)
    navigate('/admin-dashboard')
  }

  return (
    <div className="auth-shell">

      <div className="auth-aside admin-aside">
        <Brand light />

        <div>
          <span className="eyebrow">SCHOOL MANAGEMENT</span>

          <h1>
            Lead with clarity.
            Manage with confidence.
          </h1>

          <p>
            Secure access for authorized school administrators.
          </p>
        </div>

        <span className="aside-foot">
          SCHOOL PORTAL • ADMINISTRATION
        </span>
      </div>

      <main className="auth-main">

        <div className="auth-top">
          <Link to="/" className="back-link">
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <span>
            Student? <Link to="/student-login">Student login</Link>
          </span>
        </div>

        <form
          className="auth-card auth-card-narrow"
          onSubmit={submit}
        >

          <div className="auth-icon">
            <ShieldCheck />
          </div>

          <span className="eyebrow">
            ADMINISTRATOR ACCESS
          </span>

          <h2>Admin sign in</h2>

          <p className="muted">
            Sign in with your authorized admin account.
          </p>

          <Notice>{error}</Notice>

          <Field
            label="Admin email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />

          <Field
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button
            className="button button-full"
            disabled={busy}
          >
            {busy ? 'Verifying…' : 'Access admin portal'}
            <ArrowRight size={17} />
          </button>

          <p className="auth-bottom">
            Admin accounts are assigned securely by the project owner.
          </p>

          <div className="admin-home-divider" />

          <Link to="/" className="admin-home-button">
            <Home size={17} />
            Return to School Portal Home
          </Link>

        </form>
      </main>
    </div>
  )
}
