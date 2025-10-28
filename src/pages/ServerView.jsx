import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import Navbar from '../components/Navbar.jsx'

export default function ServerView() {
  const { id } = useParams()
  const [server, setServer] = useState(null)
  const [files, setFiles] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchServer = async () => {
      const { data } = await supabase.from('servers').select('*').eq('id', id).single()
      setServer(data)
    }
    const fetchFiles = async () => {
      const { data } = await supabase.from('server_files').select('*').eq('server_id', id)
      setFiles(data)
    }
    const fetchComments = async () => {
      const { data } = await supabase.from('comments').select(`*, user:users(id, email)`).eq('server_id', id)
      setComments(data)
    }

    fetchServer()
    fetchFiles()
    fetchComments()
  }, [id])

  const handleCommentSubmit = async () => {
    const user = supabase.auth.user()
    if (!user) return alert('Login first')
    const { error } = await supabase.from('comments').insert([
      { user_id: user.id, server_id: id, content: newComment }
    ])
    if (error) console.error(error)
    else {
      setComments(prev => [...prev, { content: newComment, user: { email: user.email } }])
      setNewComment('')
    }
  }

  if (!server) return <p>Loading...</p>

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h1>{server.name}</h1>
        <p>{server.description}</p>
        <h3>Files</h3>
        {files.map(f => (
          <pre key={f.id}>{f.path}: {f.content}</pre>
        ))}

        <h3>Comments</h3>
        <div>
          {comments.map((c, i) => (
            <div key={i}>
              <b>{c.user?.email}</b>: {c.content}
            </div>
          ))}
        </div>

        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleCommentSubmit}>Submit</button>
      </div>
    </>
  )
}
