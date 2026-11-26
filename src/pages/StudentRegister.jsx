
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Upload,
  UserRound,
  MapPin,
  Users
} from 'lucide-react'

import Brand from '../components/Brand.jsx'
import Field from '../components/Field.jsx'
import Notice from '../components/Notice.jsx'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'

const classes = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3']

export default function StudentRegister() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    class_name: '',
    password: '',
    confirm_password: ''
  })

  const [passport, setPassport] = useState(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!passport) {
      setPreview('')
      return
    }

    const imageUrl = URL.createObjectURL(passport)
    setPreview(imageUrl)

    return () => URL.revokeObjectURL(imageUrl)
  }, [passport])

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function selectPassport(e) {
    setError('')
    const file = e.target.files?.[0]

    if (!file) {
      setPassport(null)
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPG, PNG or WEBP passport photograph.')
      e.target.value = ''
      setPassport(null)
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setError('Your passport photograph must not be larger than 3MB.')
      e.target.value = ''
      setPassport(null)
      return
    }

    setPassport(file)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!isSupabaseConfigured) {
      return setError('Connect your Supabase project first.')
    }

    if (form.password !== form.confirm_password) {
      return setError('Your passwords do not match.')
    }

    if (!form.gender || !form.class_name) {
      return setError('Please select your gender and class.')
    }

    setBusy(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            gender: form.gender,
            class_name: form.class_name
          }
        }
      })

      if (signUpError) throw signUpError

      // Email confirmation may mean there is no active session yet.
      if (!data.session || !data.user) {
        setMessage(
          'Registration received! Check your email to confirm your account. Your passport photograph will need to be uploaded after you sign in.'
        )
        setBusy(false)
        return
      }

      let passportUrl = null

      if (passport) {
        const extension = passport.name.split('.').pop().toLowerCase()
        const filePath = `${data.user.id}/${Date.now()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('student-passports')
          .upload(filePath, passport, {
            upsert: true,
            contentType: passport.type
          })

        if (uploadError) throw uploadError

        const { data: publicData } = supabase.storage
          .from('student-passports')
          .getPublicUrl(filePath)

        passportUrl = publicData.publicUrl
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          gender: form.gender,
          class_name: form.class_name,
          ...(passportUrl ? { passport_url: passportUrl } : {})
        })
        .eq('id', data.user.id)

      if (profileError) throw profileError

      navigate('/student-dashboard')
    } catch (err) {
      setError(err.message || 'Registration could not be completed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-aside">
        <Brand light />

        <div>
          <span className="eyebrow">STUDENT REGISTRATION</span>
          <h1>Your school journey starts here.</h1>
          <p>
            Create your student account and provide the information
            needed to access your school portal.
          </p>
        </div>

        <span className="aside-foot">
          SCHOOL PORTAL • STUDENT SERVICES
        </span>
      </div>

      <main className="auth-main">
        <div className="auth-top">
          <Link to="/" className="back-link">
            <ArrowLeft size={17} /> Back home
          </Link>

          <span>
            Already registered? <Link to="/student-login">Sign in</Link>
          </span>
        </div>

        <form className="auth-card student-register-card" onSubmit={submit}>
          <div className="auth-icon">
            <UserPlus />
          </div>

          <span className="eyebrow">STUDENT ACCOUNT</span>
          <h2>Create your account</h2>
          <p className="muted">
            Complete your details to get started.
          </p>

          <Notice>{error}</Notice>
          <Notice type="success">{message}</Notice>

          <h3 className="registration-section-title">
            <UserRound size={17} /> Personal information
          </h3>

          <div className="form-grid">
            <Field
              label="First name"
              name="first_name"
              value={form.first_name}
              onChange={change}
              required
              autoComplete="given-name"
            />

            <Field
              label="Last name"
              name="last_name"
              value={form.last_name}
              onChange={change}
              required
              autoComplete="family-name"
            />

            <Field
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
              autoComplete="email"
            />

            <Field
              label="Phone number"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={change}
              required
              autoComplete="tel"
            />
          </div>

          <div className="registration-field">
            <label htmlFor="address">
              <MapPin size={15} /> Home address
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={change}
              placeholder="Enter your full home address"
              rows={3}
              required
            />
          </div>

          <h3 className="registration-section-title">
            <Users size={17} /> Student information
          </h3>

          <div className="form-grid">
            <div className="registration-field">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={change}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="registration-field">
              <label htmlFor="class_name">Class / Level</label>
              <select
                id="class_name"
                name="class_name"
                value={form.class_name}
                onChange={change}
                required
              >
                <option value="">Select class</option>
                {classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="registration-section-title">
            <Upload size={17} /> Passport photograph
          </h3>

          <div className="passport-upload">
            <div className="passport-preview">
              {preview ? (
                <img src={preview} alt="Passport preview" />
              ) : (
                <UserRound size={42} />
              )}
            </div>

            <div className="passport-upload-details">
              <label htmlFor="passport">
                <Upload size={16} /> Choose passport photo
              </label>
              <input
                id="passport"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={selectPassport}
              />
              <p>JPG, PNG or WEBP. Maximum file size: 3MB.</p>
              {passport && <span>{passport.name}</span>}
            </div>
          </div>

          <h3 className="registration-section-title">
            Account security
          </h3>

          <div className="form-grid">
            <Field
              label="Password (minimum 6 characters)"
              name="password"
              type="password"
              value={form.password}
              onChange={change}
              minLength={6}
              required
              autoComplete="new-password"
            />

            <Field
              label="Confirm password"
              name="confirm_password"
              type="password"
              value={form.confirm_password}
              onChange={change}
              minLength={6}
              required
              autoComplete="new-password"
            />
          </div>

          <button className="button button-full" disabled={busy}>
            {busy ? 'Creating account…' : 'Create student account'}
            <ArrowRight size={17} />
          </button>

          <p className="auth-bottom">
            By registering, you agree to use this portal responsibly.
          </p>
        </form>
      </main>
    </div>
  )
}
