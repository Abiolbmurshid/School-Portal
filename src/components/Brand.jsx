import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Brand({ light = false }) {
  return (
    <Link className={`brand ${light ? 'brand-light' : ''}`} to="/">
      <span className="brand-mark"><GraduationCap size={23} /></span>
      <span>Northstar<span className="brand-sub"> SCHOOL PORTAL</span></span>
    </Link>
  )
}