import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'
import Navbar from '../components/Navbar.jsx'

export default function VibeView({ vibeId }) {
  const [vibe, setVibe] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchVibe = async () => {
      const { data } = await supabase.from('vibes').select('*').eq('id', vibeId).single()
      setVibe(data)
    }
    const fetchComments = async () => {
      const { data } = await supabase.from('comments').select(`*, user:users(id,email)`).eq('vibe_id', vibeId)
      setComments(data)
    }

    fetchVibe()
    fetchComments()
  }, [vibeId])

  const handleCommentSubmit = async () => {
    const user = supabase.auth.user()
    if (!user) return alert('Login first')
    const { error } = await supabase.from('comments').insert([
      { user_id: user.id, vibe_id: vibeId, content: newComment }
    ])
    if (error) console.error(error)
    else {
      setComments(prev => [...prev, { content: newComment, user: { email: user.email } }])
      setNewComment('')
    }
  }

  if (!vibe) return <p>Loading...</p>

  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h1>{vibe.title}</h1>
        <video width="400" controls>
          <source src={vibe.video_url} type="video/mp4" />
        </video>

        <h3>Comments</h3>
        <div>
          {comments.map((c, i) => (
            <div key={i}><b>{c.user?.email}</b>: {c.content}</div>
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
