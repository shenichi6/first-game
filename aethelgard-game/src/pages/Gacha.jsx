import { useState } from 'react'

export default function Gacha({ onNavigate }) {
  const [lastPull, setLastPull] = useState(null)
  const [gems, setGems] = useState(500)
  const [history, setHistory] = useState([])
  const [pulling, setPulling] = useState(false)

  const characters = [
    { name: 'Shadow Assassin', rarity: 'Rare', rate: 0.5 },
    { name: 'Holy Priest', rarity: 'Epic', rate: 0.3 },
    { name: 'Dragon Knight', rarity: 'Legendary', rate: 0.15 },
    { name: 'Phoenix Sage', rarity: 'Legendary', rate: 0.04 },
    { name: 'Void Walker', rarity: 'Mythic', rate: 0.01 },
  ]

  const performPull = () => {
    if (gems < 100) {
      alert('Not enough gems! Need 100 gems to pull.')
      return
    }

    setPulling(true)
    setLastPull(null)

    // Simulate pulling animation
    setTimeout(() => {
      const rand = Math.random()
      let cumulative = 0
      let pulled = characters[0]

      for (let char of characters) {
        cumulative += char.rate
        if (rand < cumulative) {
          pulled = char
          break
        }
      }

      setLastPull(pulled)
      setGems(gems - 100)
      setHistory([pulled, ...history.slice(0, 9)])
      setPulling(false)
    }, 1500)
  }

  return (
    <div className="page">
      <button className="back-button" onClick={() => onNavigate('home')}>← Back</button>
      <h1>✨ Gacha Summon</h1>
      
      <div className="card">
        <h2>Gems: {gems}</h2>
        <p>Cost: 100 gems per pull</p>
        <button 
          className="button-large" 
          onClick={performPull}
          disabled={pulling || gems < 100}
          style={{ opacity: pulling || gems < 100 ? 0.5 : 1 }}
        >
          {pulling ? '🎲 Pulling...' : '🎲 Pull Character'}
        </button>
      </div>

      {lastPull && (
        <div className="card">
          <div className="gacha-result">
            🎉 You got: {lastPull.name}!
          </div>
          <p>Rarity: {lastPull.rarity}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <h2>Recent Pulls</h2>
          {history.map((char, i) => (
            <p key={i}>• {char.name} ({char.rarity})</p>
          ))}
        </div>
      )}
    </div>
  )
}
