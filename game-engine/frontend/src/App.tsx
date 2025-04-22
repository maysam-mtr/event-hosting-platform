import JitsiComponent from './components/JitsiComponent';
import Preload from './components/Preload';

function App() {
  const gameContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: 0,
  };

  const jitsiStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '300px',
    height: '300px',
    zIndex: 9999,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  };

  return (
    <div className="App" style={{ position: 'relative' }}>
      <div className="game-container" style={gameContainerStyle}>
        <Preload />
      </div>
      <div style={jitsiStyle}>
        <JitsiComponent roomName="amz" />
      </div>
    </div>
  );
}

export default App;
