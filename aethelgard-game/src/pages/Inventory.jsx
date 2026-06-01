export default function Inventory({ onNavigate }) {
  const characters = [
    { name: 'Shadow Assassin', level: 30, stars: 5 },
    { name: 'Holy Priest', level: 25, stars: 4 },
    { name: 'Dragon Knight', level: 28, stars: 5 },
  ]

  return (
    <div className="page">
      <button className="back-button" onClick={() => onNavigate('home')}>← Back</button>
      <h1>🎴 Inventory</h1>
      
      <div className="grid">
        {characters.map((char, i) => (
          <div key={i} className="card">
            <h3>{char.name}</h3>
            <p>Level: {char.level}</p>
            <p>⭐ {char.stars}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
