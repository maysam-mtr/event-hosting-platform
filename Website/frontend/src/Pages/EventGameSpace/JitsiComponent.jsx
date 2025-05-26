/**
 * Jitsi Component
 *
 * Video conferencing integration for booth interactions:
 * - Embeds Jitsi Meet for real-time video communication
 * - Configures video chat settings for booth meetings
 * - Handles participant management in video calls
 * - Provides seamless integration with the virtual environment
 * - Manages audio/video controls and screen sharing
 *
 * Enables face-to-face communication when users interact
 * with booths in the virtual event space.
 */

import { JitsiMeeting } from '@jitsi/react-sdk';

const JitsiComponent = ({ roomName }) => (
  <JitsiMeeting
    domain="descriptions-sas-kathy-sunday.trycloudflare.com"
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