import { useState } from 'react'

export default function Login({ onNavigate, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const endpoint = isLogin ? '/api/login' : '/api/register'
    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password } )
      })
      const data = await res.json()
      
      if (data.success) {
        if (isLogin) {
          onLogin(data.player)
          onNavigate('dashboard')
        } else {
          setMessage('Account created! Now login.')
          setIsLogin(true)
          setUsername('')
          setPassword('')
        }
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Error: Backend not running')
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <h1>⚔️ AETHELGARD ⚔️</h1>
        <p>{isLogin ? 'Login' : 'Create Account'}</p>
      </div>

      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: 'none'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: 'none'
            }}
          />
          <button type="submit" className="button-large" style={{ width: '100%' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {message && <p style={{ marginTop: '10px', color: '#ffff00' }}>{message}</p>}

        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{
            marginTop: '15px',
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isLogin ? 'Create Account' : 'Login'}
        </button>
      </div>
    </div>
  )
}
