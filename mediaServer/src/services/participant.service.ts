import { Socket } from 'socket.io';
import { getEmailByJwtPayload } from '../utils/auth';
import { relayServer } from '../main';
import { RTCPeerConnection } from 'wrtc';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { findClientInfoByEmail } from '../repositories/client.repsitory';
import { findRoomInfoById } from '../repositories/room.repository';
import { ClientType } from '../constants/client-type.constant';
import { findQuestion, getStreamKeyAndQuestionFromStream, saveQuestion } from '../repositories/question-repository';
import { StreamReadRaw } from '../types/redis-stream.type';
import { AskedRequestDto } from '../dto/asked.request.dto';
import { Message } from '../models/Message';
import { MessageType } from '../constants/message-type.constant';
import { sendDataToClient } from './socket.service';
import { isGuest, isParticipant, isParticipatingClient } from '../validation/client.validation';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { canEnterLecture } from '../validation/lecture.validation';

const getClientEmail = (socket: Socket) => {
  let clientId = '';
  try {
    clientId = getEmailByJwtPayload(socket.handshake.auth.accessToken);
  } catch {
    console.log('인증되지 않은 사용자 입니다. 게스트로 진행합니다.');
  }
  return clientId;
};

const getClientIdAndClientType = (socket: Socket) => {
  let email = '';
  try {
    email = getEmailByJwtPayload(socket.handshake.auth.accessToken);
  } catch {
    console.log('인증되지 않은 사용자 입니다. 게스트로 진행합니다.');
  }
  const clientId: string = email ? email : socket.id;
  const clientType: ClientType = email ? ClientType.STUDENT : ClientType.GUEST;
  return { clientId, clientType };
};

const setPresenterMediaStream = (participantRTCPC: RTCPeerConnection, roomId: string) => {
  const presenterMediaStream = relayServer.roomsConnectionInfo.get(roomId)?.stream;
  if (!presenterMediaStream) {
    console.log('발표자의 MediaStream이 존재하지 않습니다.');
    return;
  }
  presenterMediaStream.getTracks().forEach((track: MediaStreamTrack) => {
    participantRTCPC.addTrack(track);
  });
};

const askQuestion = async (presenterEmail: string, roomId: string, content: string) => {
  if (!presenterEmail) {
    // TODO: 추후 클라이언트로 에러처리 필요
    console.log('발표자가 없습니다.');
    return;
  }
  await saveQuestion(roomId, content);
  const streamData = (await findQuestion(roomId, presenterEmail)) as StreamReadRaw;
  const question = getStreamKeyAndQuestionFromStream(streamData);
  sendDataToClient(
    '/lecture',
    presenterEmail,
    'asked',
    new AskedRequestDto(MessageType.QUESTION, question.content, question.streamKey)
  );
};

const leaveRoom = (roomId: string, clientConnectionInfo: ClientConnectionInfo) => {
  relayServer.roomsConnectionInfo.get(roomId)?.exitRoom(clientConnectionInfo, roomId);
  sendDataToClient('/lecture', roomId, 'response', new Message(MessageType.LECTURE, 'success'));
};

const enterAsGuest = async (socket: Socket) => {
  const clientId = socket.handshake.auth.accessToken;
  if (!clientId) {
    console.log('잘못 된 접근입니다.');
    return;
  }
  const clientInfo = await findClientInfoByEmail(clientId);
  const roomInfo = await findRoomInfoById(clientInfo.roomId);
  const clientConnectionInfo = (await relayServer.clientsConnectionInfo.get(clientId)) as ClientConnectionInfo;
  const roomConnectionInfo = relayServer.roomsConnectionInfo.get(clientInfo.roomId) as RoomConnectionInfo;
  if (!isParticipatingClient(clientInfo, clientConnectionInfo, clientInfo.roomId)) {
    return;
  }
  if (!canEnterLecture(roomConnectionInfo)) {
    return;
  }
  socket.join(clientInfo.roomId);
  roomConnectionInfo.studentInfoList.add(clientConnectionInfo);

  socket.on('ask', async (data) => {
    if (!isGuest(clientInfo.type, clientInfo.roomId, data.roomId)) {
      return;
    }
    await askQuestion(roomInfo.presenterEmail, data.roomId, data.content);
  });

  socket.on('leave', (data) => {
    if (isParticipant(clientInfo.type, clientInfo.roomId, data.roomId)) {
      return;
    }
    leaveRoom(clientInfo.roomId, clientConnectionInfo);
  });
};

export { getClientEmail, getClientIdAndClientType, setPresenterMediaStream, askQuestion, leaveRoom, enterAsGuest };
