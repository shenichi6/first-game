import { useState } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Gacha from './pages/Gacha'
import Battle from './pages/Battle'
import Inventory from './pages/Inventory'
import Story from './pages/Story'
import PvP from './pages/PvP'
import Guild from './pages/Guild'

export default function App() {
  const [page, setPage] = useState('login')
  const [player, setPlayer] = useState(null)

  const handleLogin = (playerData) => {
    setPlayer(playerData)
    setPage('home')
  }

  const handleLogout = () => {
    setPlayer(null)
    setPage('login')
  }

  const renderPage = () => {
    if (!player) {
      return <Login onNavigate={setPage} onLogin={handleLogin} />
    }

    switch(page) {
      case 'home':
        return <Home onNavigate={setPage} onLogout={handleLogout} />
      case 'dashboard':
        return <Dashboard onNavigate={setPage} player={player} />
      case 'gacha':
        return <Gacha onNavigate={setPage} />
      case 'battle':
        return <Battle onNavigate={setPage} />
      case 'inventory':
        return <Inventory onNavigate={setPage} />
      case 'story':
        return <Story onNavigate={setPage} />
      case 'pvp':
        return <PvP onNavigate={setPage} />
      case 'guild':
        return <Guild onNavigate={setPage} />
      default:
        return <Home onNavigate={setPage} onLogout={handleLogout} />
    }
  }

  return (
    <div className="app">
      {renderPage()}
    </div>
  )
}
