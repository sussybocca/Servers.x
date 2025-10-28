import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, code } = req.body
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' })

  // Fetch code from Supabase
  const { data, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('email', email)
    .eq('code', parseInt(code))
    .gte('expires_at', new Date().toISOString())
    .limit(1)

  if (error) return res.status(500).json({ error: error.message })
  if (data.length === 0) return res.status(400).json({ error: 'Invalid or expired code' })

  // Optionally, create the user in Supabase auth table or mark verified
  await supabase.from('verification_codes').delete().eq('id', data[0].id)

  res.status(200).json({ verified: true })
}
