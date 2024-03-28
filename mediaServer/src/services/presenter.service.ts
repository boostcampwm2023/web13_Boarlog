import {
  deleteQuestionStream,
  findUnsolvedQuestions,
  isQuestionStreamExisted,
  setQuestionStreamAndGroup
} from '../repositories/question-repository';
import { StreamReadRaw } from '../types/redis-stream.type';
import { sendDataToClient, sendRoomDetailsToReconnectedPresenter } from './socket.service';
import { Message } from '../models/Message';
import { mediaConverter } from '../utils/media-converter';
import { deleteRoomInfoById, updateWhiteboardData } from '../repositories/room.repository';
import { MessageType } from '../constants/message-type.constant';
import { relayServer } from '../main';
import { ICanvasData } from '../types/canvas-data.interface';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { saveClientInfo } from '../repositories/client.repsitory';
import { ClientType } from '../constants/client-type.constant';
import { RTCPeerConnection } from 'wrtc';
import { RoomInfoResponseDto } from '../dto/room-info-response.dto';
import { ClientConnectionInfo } from '../models/ClientConnectionInfo';
import { Socket } from 'socket.io';

const setPresenterConnection = async (roomId: string, email: string, RTCPC: RTCPeerConnection, socket: Socket) => {
  relayServer.clientConnectionInfoList.set(email, new ClientConnectionInfo(RTCPC, socket));
  relayServer.roomConnectionInfoList.set(roomId, new RoomConnectionInfo(RTCPC));
  if (await isQuestionStreamExisted(roomId)) {
    await deleteQuestionStream(roomId);
  }
  await Promise.all([setQuestionStreamAndGroup(roomId), saveClientInfo(email, ClientType.PRESENTER, roomId)]);
};

const updatePresenterConnectionInfo = (email: string, RTCPC: RTCPeerConnection, socket: Socket) => {
  const presenterConnectionInfo = relayServer.clientConnectionInfoList.get(email);
  if (!presenterConnectionInfo) {
    relayServer.clientConnectionInfoList.set(email, new ClientConnectionInfo(RTCPC, socket));
    return;
  }
  presenterConnectionInfo.updateConnection(RTCPC, socket);
};

const editWhiteboard = async (roomId: string, content: ICanvasData) => {
  fetch(process.env.SERVER_API_URL + '/lecture/log/' + roomId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
  });
  await updateWhiteboardData(roomId, content);
  sendDataToClient('/lecture', roomId, 'update', new Message(MessageType.WHITEBOARD, content));
};

const endLecture = async (roomId: string, email: string) => {
  sendDataToClient('/lecture', roomId, 'ended', new Message(MessageType.LECTURE, 'finish'));
  mediaConverter.endRecording(roomId);
  relayServer.deleteRoom(email, roomId);
  await Promise.all([deleteRoomInfoById(roomId), deleteQuestionStream(roomId)]);
};

const sendPrevLectureData = async (roomId: string, email: string, roomInfo: RoomInfoResponseDto) => {
  const unsolvedQuestions = (await findUnsolvedQuestions(roomId, email)) as StreamReadRaw;
  sendRoomDetailsToReconnectedPresenter(email, roomInfo, unsolvedQuestions);
};

export { setPresenterConnection, updatePresenterConnectionInfo, editWhiteboard, endLecture, sendPrevLectureData };
