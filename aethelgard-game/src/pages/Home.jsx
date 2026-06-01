export default function Home({ onNavigate, onLogout }) {
  return (
    <div className="page">
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button 
          className="back-button" 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <div className="hero">
        <h1>⚔️ AETHELGARD ⚔️</h1>
        <p>Strategy Card Battler RPG</p>
        <button className="button-large" onClick={() => onNavigate('dashboard')}>
          Play Now
        </button>
        <button className="button-large" onClick={() => onNavigate('story')}>
          Learn More
        </button>
      </div>

      <div className="container">
        <div className="grid">
          <div className="card" onClick={() => onNavigate('gacha')} style={{ cursor: 'pointer' }}>
            <h3>✨ Gacha System</h3>
            <p>Summon powerful characters with realistic gacha rates</p>
          </div>
          <div className="card" onClick={() => onNavigate('battle')} style={{ cursor: 'pointer' }}>
            <h3>⚔️ 5v5 Battles</h3>
            <p>Strategic turn-based combat with team composition</p>
          </div>
          <div className="card" onClick={() => onNavigate('pvp')} style={{ cursor: 'pointer' }}>
            <h3>🏆 PvP Arena</h3>
            <p>Compete with players worldwide for glory and rewards</p>
          </div>
          <div className="card" onClick={() => onNavigate('guild')} style={{ cursor: 'pointer' }}>
            <h3>👥 Guilds</h3>
            <p>Join guilds and participate in guild wars</p>
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h2>Quick Links</h2>
          <button className="button-large" onClick={() => onNavigate('inventory')}>
            🎴 Inventory
          </button>
          <button className="button-large" onClick={() => onNavigate('dashboard')}>
            📊 Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
