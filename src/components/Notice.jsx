export default function Notice({ children, type = 'error' }) {
  if (!children) return null
  return <div className={`notice notice-${type}`} role="status">{children}</div>
}