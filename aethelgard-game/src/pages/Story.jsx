export default function Story({ onNavigate }) {
  const chapters = [
    { id: 1, name: 'Chapter 1: The Beginning', stages: 100, completed: 5 },
    { id: 2, name: 'Chapter 2: Rising Darkness', stages: 100, completed: 0 },
    { id: 3, name: 'Chapter 3: Eternal Conflict', stages: 100, completed: 0 },
  ]

  return (
    <div className="page">
      <button className="back-button" onClick={() => onNavigate('home')}>← Back</button>
      <h1>📖 Story Mode</h1>

      {chapters.map(chapter => (
        <div key={chapter.id} className="card">
          <h2>{chapter.name}</h2>
          <p>Stages: {chapter.completed}/{chapter.stages}</p>
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
              width: `${(chapter.completed / chapter.stages) * 100}%`,
              transition: 'width 0.3s'
            }}></div>
          </div>
          <button className="button-large" style={{ marginTop: '15px' }}>
            {chapter.completed === 0 ? 'Start' : 'Continue'} Chapter
          </button>
        </div>
      ))}
    </div>
  )
}
