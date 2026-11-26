import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LogIn } from 'lucide-react'
import Brand from '../components/Brand.jsx'
import Field from '../components/Field.jsx'
import Notice from '../components/Notice.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

export default function StudentLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault(); setError('')
    if (!isSupabaseConfigured) return setError('Supabase is not configured yet. Follow the README setup instructions.')
    setBusy(true)
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (loginError) {
      const msg = loginError.message.toLowerCase().includes('email not confirmed')
        ? 'Email not confirmed. Open the confirmation email from Supabase, or disable email confirmation for local testing in Supabase Authentication settings.'
        : loginError.message
      return setError(msg)
    }
    navigate('/student-dashboard')
  }

  return <div className="auth-shell">
    <div className="auth-aside"><Brand light /><div><span className="eyebrow">YOUR LEARNING SPACE</span><h1>Welcome back to your school community.</h1><p>Sign in to continue to your student dashboard.</p></div><span className="aside-foot">NORTHSTAR • STUDENT SERVICES</span></div>
    <main className="auth-main"><div className="auth-top"><Link to="/" className="back-link"><ArrowLeft size={17} /> Back home</Link><span>New student? <Link to="/register">Create account</Link></span></div>
      <form className="auth-card auth-card-narrow" onSubmit={submit}>
        <div className="auth-icon"><LogIn /></div><span className="eyebrow">STUDENT SIGN IN</span><h2>Welcome back</h2><p className="muted">Sign in to continue to your portal.</p>
        <Notice>{error}</Notice>
        <Field label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
        <Field label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        <button className="button button-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={17} /></button>
        <p className="auth-bottom">Having trouble? Contact your school administrator.</p>
      </form>
    </main>
  </div>
}