import { relayServer } from '../main';
import { StreamReadRaw } from '../types/redis-stream.type';
import { RoomInfoResponseDto } from '../dto/room-info-response.dto';

const sendDataToClient = (namespace: string, target: string, eventName: string, data: any) => {
  relayServer.socket.of(namespace).to(target).emit(eventName, data);
};

const sendRoomDetailsToReconnectedPresenter = (
  email: string,
  roomInfo: RoomInfoResponseDto,
  unsolvedQuestions: StreamReadRaw
) => {
  sendDataToClient('/create-room', email, 'reconnectPresenter', {
    whiteboard: roomInfo.currentWhiteboardData,
    startTime: roomInfo.startTime,
    questions: unsolvedQuestions[0][1]
  });
};

export { sendDataToClient, sendRoomDetailsToReconnectedPresenter };
