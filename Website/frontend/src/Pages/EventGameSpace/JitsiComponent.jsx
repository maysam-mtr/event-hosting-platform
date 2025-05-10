import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiComponent = ({ roomName }) => (
  <JitsiMeeting
    domain="meet.eventure3.duckdns.org"
    roomName={roomName}
    configOverwrite={{
      startWithAudioMuted: true,
      disableModeratorIndicator: true
    }}
    interfaceConfigOverwrite={{
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
    }}
    userInfo={{ displayName: 'User' }}
    getIFrameRef={iframeRef => {
      iframeRef.style.width = '100%';
      iframeRef.style.height = '100%';
    }}
    onApiReady={externalApi => {
      console.log('Jitsi API ready:', externalApi);
    }}
  />
);

export default JitsiComponent;