import styled from 'styled-components';
import Preload from './Preload';
import JitsiComponent from './JitsiComponent';
import { useLocation } from 'react-router-dom';

const GameContainer = styled.div`
display: flex;
justifyContent: center;
alignItems: center;
height: 100vh;
width: 100vw;
margin: 0;
`;

export default function EventGameSpace(){

  const location = useLocation()
  const { eventId } = location.state

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
          <GameContainer style={gameContainerStyle}>
            <Preload eventId={eventId}/>
          </GameContainer>
          {/* <div style={jitsiStyle}>
            <JitsiComponent roomName="amz" />
          </div> */}
        </div>
      );
}