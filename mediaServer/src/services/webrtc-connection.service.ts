import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescriptionInit } from 'wrtc';
import { relayServer } from '../main';
import { Socket } from 'socket.io';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { mediaConverter } from '../utils/media-converter';
import { ServerAnswerDto } from '../dto/server-answer.dto';
import { setPresenterMediaStream } from './participant.service';
import { sendDataToClient } from './socket.service';

const setTrackEvent = (RTCPC: RTCPeerConnection, roomId: string) => {
  RTCPC.ontrack = (event) => {
    const roomInfo = relayServer.roomsConnectionInfo.get(roomId);
    if (roomInfo) {
      roomInfo.stream = event.streams[0];
      roomInfo.studentInfoList.forEach((clientConnectionInfo: ClientConnectionInfo) => {
        event.streams[0].getTracks().forEach(async (track: MediaStreamTrack) => {
          await clientConnectionInfo.RTCPC.getSenders()[0].replaceTrack(track);
        });
      });
      mediaConverter.setSink(event.streams[0], roomId);
    }
  };
};

const exchangeCandidate = (namespace: string, email: string, socket: Socket) => {
  try {
    const RTCPC = relayServer.clientsConnectionInfo.get(email)?.RTCPC;
    if (!RTCPC) {
      console.log('candidate를 교환할 수 없습니다.');
      return;
    }
    RTCPC.onicecandidate = (e) => {
      if (e.candidate) {
        sendDataToClient(namespace, email, 'serverCandidate', {
          candidate: e.candidate
        });
      }
    };
    socket.on('clientCandidate', (data) => {
      RTCPC.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  } catch (e) {
    console.log(e);
  }
};

const setPresenterWebRTCConnection = async (
  roomId: string,
  email: string,
  RTCPC: RTCPeerConnection,
  socket: Socket,
  offer: RTCSessionDescriptionInit
) => {
  setTrackEvent(RTCPC, roomId);
  exchangeCandidate('/create-room', email, socket);
  await RTCPC.setRemoteDescription(offer);
  const answer = await RTCPC.createAnswer();
  sendDataToClient('/create-room', email, 'serverAnswer', {
    SDP: answer
  });
  RTCPC.setLocalDescription(answer);
};

const setParticipantWebRTCConnection = async (
  roomId: string,
  clientId: string,
  RTCPC: RTCPeerConnection,
  roomInfo: Record<string, string>,
  socket: Socket,
  offer: RTCSessionDescriptionInit
) => {
  setPresenterMediaStream(RTCPC, roomId);
  exchangeCandidate('/enter-room', clientId, socket);
  RTCPC.setRemoteDescription(offer);
  const answer = await RTCPC.createAnswer();
  const answerData = new ServerAnswerDto(JSON.parse(roomInfo.currentWhiteboardData), roomInfo.startTime, answer);
  sendDataToClient('/enter-room', clientId, 'serverAnswer', answerData);
  RTCPC.setLocalDescription(answer);
};

export { setTrackEvent, exchangeCandidate, setPresenterWebRTCConnection, setParticipantWebRTCConnection };
