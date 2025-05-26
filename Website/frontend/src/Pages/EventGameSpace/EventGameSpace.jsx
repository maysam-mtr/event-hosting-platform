import styled from 'styled-components';
import Preload from './Preload';
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
      return (
        <div className="App" style={{ position: 'relative' }}>
          <GameContainer style={gameContainerStyle}>
            <Preload eventId={eventId}/>
          </GameContainer>
        </div>
      );
}