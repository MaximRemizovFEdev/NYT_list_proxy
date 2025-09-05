import express from 'express'
import fetch from 'node-fetch'

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.get('/proxy/*', async (req, res) => {
  try {
    const target = req.params[0] // полный URL идёт после /proxy/
    const r = await fetch(target)
    const text = await r.text()
    res.status(r.status).type(r.headers.get('content-type') || 'application/json').send(text)
  } catch (e) {
    res.status(500).json({ error: 'proxy error' })
  }
})

app.listen(process.env.PORT || 3000) 