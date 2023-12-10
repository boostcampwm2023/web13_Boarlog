import { RoomInfoDto } from '../dto/room-info.dto';
import { redis } from '../config/redis.config';
import { ROOM_INFO_KEY_PREFIX } from '../constants/redis-key.constant';
import { ICanvasData } from '../interfaces/canvas-data.interface';

const findRoomInfoById = (roomId: string) => {
  return redis.hgetall(ROOM_INFO_KEY_PREFIX + roomId);
};

const saveRoomInfo = (roomId: string, roomInfo: RoomInfoDto) => {
  redis.hset(ROOM_INFO_KEY_PREFIX + roomId, roomInfo);
};

const updateWhiteboardData = async (roomId: string, whiteboardData: ICanvasData) => {
  await redis.hset(ROOM_INFO_KEY_PREFIX + roomId, { currentWhiteboardData: JSON.stringify(whiteboardData) });
};

export { findRoomInfoById, saveRoomInfo, updateWhiteboardData };
