import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaComments, FaDesktop } from 'react-icons/fa';
import { FiLogOut, FiZoomIn, FiZoomOut } from 'react-icons/fi';

const ControlPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #1c1c1e;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #333;
  z-index: 1000;
`;

const ControlButton = styled.button`
  background-color: #1c1c1e;
  color: #fff;
  border: 2px solid ${({ active }) => (active ? '#00ff5f' : '#3a3a3c')};
  border-radius: 999px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #2c2c2e;
    border-color: ${({ active }) => (active ? '#00ff5f' : '#4a4a4c')};
  }

  & svg {
    font-size: 16px;
  }
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.span`
  white-space: nowrap;
`;

const LeaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: #e53935; /* bright red */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;

  &:hover {
    background-color: #c62828; /* darker red on hover */
  }
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  z-index: 10;
`;

const ZoomPanel = styled.div`
  position: fixed;
  bottom: 100px;
  left: 10px;
  display: flex;
  flex-direction: column;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 10px;
  padding: 8px;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
`;

const ZoomButton = styled.button`
  background: white;
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
  }

  svg {
    color: #333;
  }
`;


const GameControls = ({ onZoomIn, onZoomOut, toggleMic, isMicMuted, toggleCamera, isCamMuted, openChat, isChatOpened, isPartner, toggleScreenShare, isSharingScreen, inMeeting }) => {
  const navigate = useNavigate();

  const handleLeave = () => {
    navigate('/', {replcae: true});
  };

  return (
    <>
      <ZoomPanel>
        <ZoomButton onClick={onZoomIn}>
          <FiZoomIn size={18} />
        </ZoomButton>
        <ZoomButton onClick={onZoomOut}>
          <FiZoomOut size={18} />
        </ZoomButton>
      </ZoomPanel>

      <ControlPanel style={{ justifyContent: inMeeting ? 'center' : 'flex-end', paddingRight: inMeeting ? '0' : '20px' }}>
        {inMeeting && (
            <>
            <ControlButton onClick={toggleMic} active={!isMicMuted}>
                <IconWrapper>{isMicMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}</IconWrapper>
                <Label>{isMicMuted ? 'Unmute' : 'Mute'}</Label>
            </ControlButton>

            <ControlButton onClick={toggleCamera} active={!isCamMuted}>
                <IconWrapper>{isCamMuted ? <FaVideoSlash /> : <FaVideo />}</IconWrapper>
                <Label>{isCamMuted ? 'Start Video' : 'Stop Video'}</Label>
            </ControlButton>

            <ControlButton onClick={openChat} active={isChatOpened}>
                <IconWrapper><FaComments /></IconWrapper>
                <Label>{isChatOpened ? 'Close Chat' : 'Open Chat'}</Label>
            </ControlButton>

            {isPartner && (
                <ControlButton onClick={toggleScreenShare} active={isSharingScreen}>
                <IconWrapper><FaDesktop /></IconWrapper>
                <Label>{isSharingScreen ? 'Stop Share' : 'Share Screen'}</Label>
                </ControlButton>
            )}
            </>
        )}

        <LeaveButton onClick={handleLeave}>
            <FiLogOut size={18} />
            <span>Leave</span>
        </LeaveButton>
        </ControlPanel>

    </>
  );
};

export default GameControls;
