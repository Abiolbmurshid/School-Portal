import { Link } from 'react-router-dom'
export default function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 • PAGE NOT FOUND</span><h1>This page isn't here.</h1><p className="muted">Check the address or return to the homepage.</p><Link className="button" to="/">Back to homepage</Link></main>
}