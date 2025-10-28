import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import Navbar from '../components/Navbar.jsx'

export default function ServerView() {
  const { id } = useParams()
  const [server, setServer] = useState(null)

  useEffect(() => {
    const fetchServer = async () => {
      const { data, error } = await supabase.from('servers').select('*').eq('id', id).single()
      if (error) console.error(error)
      else setServer(data)
    }
    fetchServer()
  }, [id])

  if (!server) return <p>Loading...</p>

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h1>{server.name}</h1>
        <p>{server.description}</p>
        <p>Views: {server.views}</p>
      </div>
    </>
  )
}
