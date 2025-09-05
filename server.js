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
    const base = req.params[0]                     // https://api.nytimes.com/svc/...
    const qs = req.url.includes('?') ? req.url.split('?')[1] : '' // всё после ?
    const target = qs ? `${base}?${qs}` : base     // восстановили полный URL
    
    const r = await fetch(target)
    const text = await r.text()
    const contentType = r.headers.get('content-type') || 'application/json'
    console.log(`[proxy] ${new Date().toISOString()} status=${r.status} url=${target} content-type=${contentType} bytes=${text.length}`)
    res.status(r.status).type(contentType).send(text)
  } catch (e) {
    console.error('[proxy:error]', e)
    res.status(500).json({ error: 'proxy error' })
  }
})

app.listen(process.env.PORT || 3000) 