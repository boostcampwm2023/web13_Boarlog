import { RTCIceCandidate, RTCPeerConnection, RTCSessionDescriptionInit } from 'wrtc';
import { relayServer } from '../main';
import { Socket } from 'socket.io';
import { mediaConverter } from '../utils/media-converter';
import { ServerAnswerDto } from '../dto/server-answer.dto';
import { setPresenterMediaStream } from './participant.service';
import { sendDataToClient } from './socket.service';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { RoomInfoResponseDto } from '../dto/room-info-response.dto';

const setTrackEvent = (RTCPC: RTCPeerConnection, roomId: string) => {
  RTCPC.ontrack = (event) => {
    const roomInfo = relayServer.roomConnectionInfoList.get(roomId);
    if (!roomInfo) {
      console.log('강의실이 존재하지 않습니다.');
      return;
    }
    roomInfo.stream = event.streams[0];
    setPresenterAudioTrack(roomInfo, roomInfo.stream);
    mediaConverter.startRecording(roomId, roomInfo.stream);
  };
};

const exchangeCandidate = (namespace: string, email: string, socket: Socket) => {
  try {
    const RTCPC = relayServer.clientConnectionInfoList.get(email)?.RTCPC;
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
  roomInfo: RoomInfoResponseDto,
  socket: Socket,
  offer: RTCSessionDescriptionInit
) => {
  setPresenterMediaStream(RTCPC, roomId);
  exchangeCandidate('/enter-room', clientId, socket);
  RTCPC.setRemoteDescription(offer);
  const answer = await RTCPC.createAnswer();
  const answerData = new ServerAnswerDto(roomInfo, answer);
  sendDataToClient('/enter-room', clientId, 'serverAnswer', answerData);
  RTCPC.setLocalDescription(answer);
};

const setPresenterAudioTrack = (roomInfo: RoomConnectionInfo, presenterMediaStream: MediaStream) => {
  roomInfo.participantIdList.forEach((participantId: string) => {
    const participantConnectionInfo = relayServer.clientConnectionInfoList.get(participantId);
    if (participantConnectionInfo) {
      presenterMediaStream.getTracks().forEach(async (track: MediaStreamTrack) => {
        await participantConnectionInfo.RTCPC.getSenders()[0].replaceTrack(track);
      });
    }
  });
};

export { setTrackEvent, exchangeCandidate, setPresenterWebRTCConnection, setParticipantWebRTCConnection };
