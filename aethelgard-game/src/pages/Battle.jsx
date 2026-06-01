import { useState } from 'react'

export default function Battle({ onNavigate }) {
  const [battleStarted, setBattleStarted] = useState(false)
  const [playerTeam, setPlayerTeam] = useState([
    { id: 1, name: 'Shadow Assassin', hp: 100, maxHp: 100, attack: 25 },
    { id: 2, name: 'Holy Priest', hp: 80, maxHp: 80, attack: 15 },
    { id: 3, name: 'Dragon Knight', hp: 120, maxHp: 120, attack: 30 },
  ])
  const [enemyTeam, setEnemyTeam] = useState([
    { id: 101, name: 'Dark Knight', hp: 110, maxHp: 110, attack: 28 },
    { id: 102, name: 'Shadow Mage', hp: 75, maxHp: 75, attack: 35 },
    { id: 103, name: 'Void Warrior', hp: 100, maxHp: 100, attack: 26 },
  ])
  const [log, setLog] = useState([])

  const attack = () => {
    // Random player attack
    const playerAttacker = playerTeam[Math.floor(Math.random() * playerTeam.length)]
    const enemyTarget = enemyTeam[Math.floor(Math.random() * enemyTeam.length)]
    const damage = Math.floor(Math.random() * 20) + playerAttacker.attack

    const newEnemyTeam = enemyTeam.map(e => 
      e.id === enemyTarget.id ? { ...e, hp: Math.max(0, e.hp - damage) } : e
    ).filter(e => e.hp > 0)

    setLog([`${playerAttacker.name} attacks ${enemyTarget.name} for ${damage} damage!`, ...log])
    setEnemyTeam(newEnemyTeam)

    if (newEnemyTeam.length === 0) {
      setLog(['You won the battle! 🎉', ...log])
      setBattleStarted(false)
      return
    }

    // Enemy counter attack
    setTimeout(() => {
      const enemyAttacker = newEnemyTeam[Math.floor(Math.random() * newEnemyTeam.length)]
      const playerTarget = playerTeam[Math.floor(Math.random() * playerTeam.length)]
      const counterDamage = Math.floor(Math.random() * 20) + enemyAttacker.attack

      const newPlayerTeam = playerTeam.map(p => 
        p.id === playerTarget.id ? { ...p, hp: Math.max(0, p.hp - counterDamage) } : p
      ).filter(p => p.hp > 0)

      setLog([`${enemyAttacker.name} attacks ${playerTarget.name} for ${counterDamage} damage!`, ...log])
      setPlayerTeam(newPlayerTeam)

      if (newPlayerTeam.length === 0) {
        setLog(['You lost the battle! 💀', ...log])
        setBattleStarted(false)
      }
    }, 500)
  }

  return (
    <div className="page">
      <button className="back-button" onClick={() => onNavigate('home')}>← Back</button>
      <h1>⚔️ Battle</h1>

      {!battleStarted ? (
        <div className="card">
          <h2>Start Battle</h2>
          <button className="button-large" onClick={() => setBattleStarted(true)}>
            ⚔️ Start Battle
          </button>
        </div>
      ) : (
        <div>
          <div className="battle-container">
            <div className="team">
              <h2>Your Team ({playerTeam.length})</h2>
              {playerTeam.map(char => (
                <div key={char.id} className="card">
                  <p><strong>{char.name}</strong></p>
                  <div style={{ 
                    background: 'rgba(0,0,0,0.2)', 
                    height: '15px', 
                    borderRadius: '5px', 
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #00ff00, #ffff00)',
                      width: `${(char.hp / char.maxHp) * 100}%`
                    }}></div>
                  </div>
                  <small>{char.hp}/{char.maxHp} HP</small>
                </div>
              ))}
            </div>

            <div className="vs">VS</div>

            <div className="team">
              <h2>Enemy Team ({enemyTeam.length})</h2>
              {enemyTeam.map(char => (
                <div key={char.id} className="card">
                  <p><strong>{char.name}</strong></p>
                  <div style={{ 
                    background: 'rgba(0,0,0,0.2)', 
                    height: '15px', 
                    borderRadius: '5px', 
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #ff0000, #ff6600)',
                      width: `${(char.hp / char.maxHp) * 100}%`
                    }}></div>
                  </div>
                  <small>{char.hp}/{char.maxHp} HP</small>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <button className="button-large" onClick={attack} disabled={playerTeam.length === 0 || enemyTeam.length === 0}>
              ⚔️ Attack
            </button>
            <button className="button-large" onClick={() => setBattleStarted(false)}>
              Flee
            </button>
          </div>

          {log.length > 0 && (
            <div className="card">
              <h3>Battle Log</h3>
              {log.slice(0, 5).map((entry, i) => (
                <p key={i} style={{ fontSize: '12px' }}>• {entry}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
