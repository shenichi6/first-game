export default function Guild({ onNavigate }) {
  const guilds = [
    { id: 1, name: 'Eternal Dragons', level: 15, members: 47, leader: 'DragonSlayer' },
    { id: 2, name: 'Phoenix Rising', level: 12, members: 35, leader: 'SilverArrow' },
    { id: 3, name: 'Void Walkers', level: 10, members: 28, leader: 'ShadowMaster' },
  ]

  return (
    <div className="page">
      <button className="back-button" onClick={() => onNavigate('home')}>← Back</button>
      <h1>👥 Guild System</h1>

      <div className="card">
        <h2>Create or Join a Guild</h2>
        <button className="button-large">➕ Create Guild</button>
      </div>

      <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>Available Guilds</h2>
      {guilds.map(guild => (
        <div key={guild.id} className="card">
          <h3>{guild.name}</h3>
          <p>Level: {guild.level}</p>
          <p>Members: {guild.members}/50</p>
          <p>Leader: {guild.leader}</p>
          <button className="button-large">Join Guild</button>
        </div>
      ))}
    </div>
  )
}
