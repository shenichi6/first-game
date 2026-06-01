import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const app = express()
app.use(cors())
app.use(express.json())

let db

// Initialize database
async function initDb() {
  db = await open({
    filename: './game.db',
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      level INTEGER DEFAULT 1,
      exp INTEGER DEFAULT 0,
      gold INTEGER DEFAULT 50000,
      gems INTEGER DEFAULT 500,
      characters INTEGER DEFAULT 3,
      pvpRating INTEGER DEFAULT 1000,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('Database initialized!')
}

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  try {
    await db.run(
      'INSERT INTO players (username, password) VALUES (?, ?)',
      [username, password]
    )
    res.json({ success: true, message: 'Player created!' })
  } catch (err) {
    res.json({ success: false, message: 'Username already exists' })
  }
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const player = await db.get(
    'SELECT * FROM players WHERE username = ? AND password = ?',
    [username, password]
  )
  
  if (player) {
    res.json({ success: true, player })
  } else {
    res.json({ success: false, message: 'Invalid credentials' })
  }
})

app.get('/api/player/:id', async (req, res) => {
  const player = await db.get('SELECT * FROM players WHERE id = ?', [req.params.id])
  res.json(player)
})

app.put('/api/player/:id', async (req, res) => {
  const { level, exp, gold, gems, characters, pvpRating, wins, losses } = req.body
  await db.run(
    'UPDATE players SET level = ?, exp = ?, gold = ?, gems = ?, characters = ?, pvpRating = ?, wins = ?, losses = ? WHERE id = ?',
    [level, exp, gold, gems, characters, pvpRating, wins, losses, req.params.id]
  )
  res.json({ success: true })
})

const PORT = 3001
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}` )
  })
})
