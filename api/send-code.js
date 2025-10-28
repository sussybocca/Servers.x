import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000)

  // Save code to Supabase with expiration (e.g., 10 minutes)
  const { data, error } = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/verification_codes`,
    {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min
      })
    }
  )

  if (error) return res.status(500).json({ error: error.message })

  // Send email using NodeMailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS
    }
  })

  try {
    await transporter.sendMail({
      from: `"VibeSpace" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: 'Your VibeSpace Verification Code',
      text: `Your verification code is: ${code}`
    })

    return res.status(200).json({ success: true, code }) // code returned only for testing
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email', details: err.message })
  }
}
