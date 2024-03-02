import {
  deleteQuestionStream,
  findUnsolvedQuestions,
  isQuestionStreamExisted,
  setQuestionStreamAndGroup
} from '../repositories/question-repository';
import { StreamReadRaw } from '../types/redis-stream.type';
import { sendDataToClient } from './socket.service';
import { Message } from '../models/Message';
import { mediaConverter } from '../utils/media-converter';
import { deleteRoomInfoById, saveRoomInfo, updateWhiteboardData } from '../repositories/room.repository';
import { MessageType } from '../constants/message-type.constant';
import { relayServer } from '../main';
import { ICanvasData } from '../types/canvas-data.interface';
import { RoomConnectionInfo } from '../models/RoomConnectionInfo';
import { saveClientInfo } from '../repositories/client.repsitory';
import { ClientType } from '../constants/client-type.constant';
import { RoomInfoDto } from '../dto/room-info.dto';
import { RTCPeerConnection } from 'wrtc';

const setPresenterConnection = async (
  roomId: string,
  email: string,
  RTCPC: RTCPeerConnection,
  initBoardData: ICanvasData
) => {
  relayServer.roomConnectionInfoList.set(roomId, new RoomConnectionInfo(RTCPC));
  if (await isQuestionStreamExisted(roomId)) {
    await deleteQuestionStream(roomId);
  }
  await setQuestionStreamAndGroup(roomId);
  await Promise.all([
    saveClientInfo(email, ClientType.PRESENTER, roomId),
    saveRoomInfo(roomId, new RoomInfoDto(email, initBoardData))
  ]);
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
  mediaConverter.setFfmpeg(roomId);
  relayServer.roomConnectionInfoList.get(roomId)?.endLecture(roomId);
  relayServer.roomConnectionInfoList.delete(roomId);
  relayServer.clientConnectionInfoList.delete(email);
  await Promise.all([deleteRoomInfoById(roomId), deleteQuestionStream(roomId)]);
};

const sendPrevLectureData = async (roomId: string, email: string, roomInfo: Record<string, string>) => {
  const unsolvedQuestions = (await findUnsolvedQuestions(roomId, email)) as StreamReadRaw;
  sendDataToClient('/create-room', email, 'reconnectPresenter', {
    whiteboard: JSON.parse(roomInfo.currentWhiteboardData),
    startTime: roomInfo.startTime,
    questions: unsolvedQuestions[0][1]
  });
};

export { setPresenterConnection, editWhiteboard, endLecture, sendPrevLectureData };
