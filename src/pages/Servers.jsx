import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import Navbar from '../components/Navbar.jsx'
import { Link } from 'react-router-dom'

export default function Servers() {
  const [servers, setServers] = useState([])

  useEffect(() => {
    const fetchServers = async () => {
      const { data, error } = await supabase.from('servers').select('*')
      if (error) console.error(error)
      else setServers(data)
    }
    fetchServers()
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h1>Servers</h1>
        <ul>
          {servers.map(server => (
            <li key={server.id}>
              <Link to={`/server/${server.id}`}>{server.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
