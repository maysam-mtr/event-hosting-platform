import Preload from './components/Preload'

function App() {
  const gameContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: 0,
  }

  return (
    <div className="App">
      <div className="game-container" style={gameContainerStyle}>
        <Preload />
      </div>
    </div>
  )
}

export default App