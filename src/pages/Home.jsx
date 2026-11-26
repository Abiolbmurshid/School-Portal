
import {
  GraduationCap,
  UserRound,
  UserPlus,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'

import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="portal-home">
      <div className="portal-overlay" />

      <header className="portal-header">
        <div className="portal-logo">
          <GraduationCap size={30} />
          <span>SCHOOL PORTAL</span>
        </div>

        <Link to="/admin-login" className="portal-admin-link">
          <ShieldCheck size={17} />
          Admin Login
        </Link>
      </header>

      <section className="portal-content">
        <span className="portal-welcome">
          WELCOME TO OUR DIGITAL CAMPUS
        </span>

        <h1>
          SCHOOL
          <span>PORTAL</span>
        </h1>

        <p>
          Your central access point for learning,
          school information and academic activities.
        </p>

        <div className="portal-buttons">
          <Link to="/student-login" className="portal-button portal-button-primary">
            <UserRound size={20} />
            Student Login
            <ArrowRight size={17} />
          </Link>

          <Link to="/register" className="portal-button portal-button-secondary">
            <UserPlus size={20} />
            Student Registration
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="portal-security">
          <ShieldCheck size={17} />
          Secure Student and Administrator Access
        </div>
      </section>

      <footer className="portal-footer">
        <span>LEARNING • EXCELLENCE • SUCCESS</span>
        <span>© {new Date().getFullYear()} School Portal</span>
      </footer>
    </main>
  )
}
