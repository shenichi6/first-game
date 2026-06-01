import { useState } from 'react'

export default function Dashboard({ onNavigate }) {
  const [player] = useState({
    name: 'Adventurer',
    level: 25,
    exp: 7500,
    maxExp: 10000,
    gold: 50000,
    gems: 500,
    characters: 12,
    pvpRating: 3250,
    pvpRank: 'Gold',
    wins: 45,
    losses: 12,
  })

  return (
    <div className="page">
      <button className="back-button" onClick={() => onNavigate('home')}>← Back</button>
      <h1>📊 Dashboard</h1>
      
      <div className="grid">
        <div className="card">
          <h2>{player.name}</h2>
          <p>Level {player.level}</p>
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            height: '20px', 
            borderRadius: '10px', 
            overflow: 'hidden',
            marginTop: '10px'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00ff00, #ffff00)',
              width: `${(player.exp / player.maxExp) * 100}%`
            }}></div>
          </div>
          <small>{player.exp}/{player.maxExp} EXP</small>
        </div>

        <div className="card">
          <h3>💰 Gold</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>
            {player.gold.toLocaleString()}
          </p>
        </div>

        <div className="card">
          <h3>💎 Gems</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ffff' }}>
            {player.gems}
          </p>
        </div>

        <div className="card">
          <h3>🎴 Characters</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {player.characters}
          </p>
        </div>

        <div className="card">
          <h3>🏆 PvP Stats</h3>
          <p>Rating: {player.pvpRating}</p>
          <p>Rank: {player.pvpRank}</p>
          <p>W/L: {player.wins}/{player.losses}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h2>Quick Actions</h2>
        <button className="button-large" onClick={() => onNavigate('gacha')}>
          ✨ Summon
        </button>
        <button className="button-large" onClick={() => onNavigate('battle')}>
          ⚔️ Battle
        </button>
        <button className="button-large" onClick={() => onNavigate('pvp')}>
          🏆 PvP
        </button>
      </div>
    </div>
  )
}
