import { Socket } from 'socket.io';
import { getEmailByJwtPayload } from '../utils/auth';
import { relayServer } from '../main';
import { pc_config } from '../config/pc.config';
import { RTCPeerConnection } from 'wrtc';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';

const getClientEmail = (socket: Socket) => {
  let clientId = '';
  try {
    clientId = getEmailByJwtPayload(socket.handshake.auth.accessToken);
  } catch {
    console.log('인증되지 않은 사용자 입니다. 게스트로 진행합니다.');
  }
  return clientId;
};

const setParticipantConnection = (clientId: string) => {
  const participantRTCPC = new RTCPeerConnection(pc_config);
  relayServer.clientConnectionInfo.set(clientId, new ClientConnectionInfo(participantRTCPC));
  return participantRTCPC;
};

const setPresenterMediaStream = (participantRTCPC: RTCPeerConnection, roomId: string) => {
  const presenterMediaStream = relayServer.roomsConnectionInfo.get(roomId)?.stream;
  if (!presenterMediaStream) {
    console.log('발표자의 MediaStream이 존재하지 않습니다.');
    return;
  }
  presenterMediaStream.getTracks().forEach((track: any) => {
    participantRTCPC.addTrack(track);
  });
};

export { getClientEmail, setParticipantConnection, setPresenterMediaStream };
