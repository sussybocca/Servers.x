import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, serverId } = req.body
  if (!userId || !serverId) return res.status(400).json({ error: 'Missing parameters' })

  try {
    // Add user to server members table
    await supabase.from('server_members').upsert({ user_id: userId, server_id: serverId })

    // Increment server views
    await supabase.rpc('increment_server_views', { server_id: serverId })

    res.status(200).json({ joined: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
