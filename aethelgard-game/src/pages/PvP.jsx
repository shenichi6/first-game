export default function PvP({ onNavigate }) {
  const leaderboard = [
    { rank: 1, name: 'ShadowKing', level: 50, rating: 4850 },
    { rank: 2, name: 'PhoenixRise', level: 48, rating: 4720 },
    { rank: 3, name: 'CelestialSage', level: 47, rating: 4580 },
    { rank: 4, name: 'IceWizard', level: 45, rating: 4420 },
    { rank: 5, name: 'VoidWalker', level: 44, rating: 4250 },
  ]

  return (
    <div className="page">
      <button className="back-button" onClick={() => onNavigate('home')}>← Back</button>
      <h1>🏆 PvP Arena</h1>

      <div className="card">
        <h2>Your Stats</h2>
        <p>Rating: 3250</p>
        <p>Rank: Gold</p>
        <button className="button-large">⚔️ Find Opponent</button>
      </div>

      <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>Global Leaderboard</h2>
      {leaderboard.map(entry => (
        <div key={entry.rank} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>#{entry.rank}</span>
            <h3>{entry.name}</h3>
            <p>Level {entry.level}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3>{entry.rating}</h3>
            <p>Rating</p>
          </div>
        </div>
      ))}
    </div>
  )
}
