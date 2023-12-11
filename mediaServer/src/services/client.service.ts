import { redis } from '../config/redis.config';
import { CLIENT_INFO_KEY_PREFIX } from '../constants/redis-key.constant';
import { ClientType } from '../constants/client-type.constant';
import { ClientInfoDto } from '../dto/client-info.dto';
import { findUnsolvedQuestions } from './question-service';
import { StreamReadRaw } from '../types/redis-stream.type';
import { sendMessageUsingSocket } from './socket.service';

const findClientInfoByEmail = async (email: string) => {
  return await redis.hgetall(CLIENT_INFO_KEY_PREFIX + email);
};

const saveClientInfo = async (email: string, clientType: ClientType, roomId: string) => {
  await redis.hset(CLIENT_INFO_KEY_PREFIX + email, new ClientInfoDto(clientType, roomId));
};

const sendDataToReconnectPresenter = async (email: string, roomId: string, roomInfo: Record<string, string>) => {
  const unsolvedQuestions = (await findUnsolvedQuestions(roomId, email)) as StreamReadRaw;
  sendMessageUsingSocket('/create-room', email, 'reconnectPresenter', {
    whiteboard: roomInfo.currentWhiteboardData,
    startTime: roomInfo.startTime,
    questions: unsolvedQuestions[0][1]
  });
};

export { findClientInfoByEmail, saveClientInfo, sendDataToReconnectPresenter };
