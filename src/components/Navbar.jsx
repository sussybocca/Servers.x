import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#222', color: '#fff' }}>
      <Link to="/" style={{ marginRight: '1rem', color: '#fff' }}>Servers</Link>
      <Link to="/vibes" style={{ marginRight: '1rem', color: '#fff' }}>Vibes</Link>
      <Link to="/editor" style={{ marginRight: '1rem', color: '#fff' }}>Editor</Link>
      <Link to="/dashboard" style={{ marginRight: '1rem', color: '#fff' }}>Dashboard</Link>
      <Link to="/auth" style={{ color: '#fff' }}>Auth</Link>
    </nav>
  )
}
