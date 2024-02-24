import { ClientType } from '../constants/client-type.constant';
import { redis } from '../config/redis.config';
import { CLIENT_INFO_KEY_PREFIX } from '../constants/redis-key.constant';
import { ClientInfoDto } from '../dto/client-info.dto';

const findClientInfoByEmail = async (email: string) => {
  return await redis.hgetall(CLIENT_INFO_KEY_PREFIX + email);
};

const saveClientInfo = async (email: string, clientType: ClientType, roomId: string) => {
  await redis.hset(CLIENT_INFO_KEY_PREFIX + email, new ClientInfoDto(clientType, roomId));
};

export { saveClientInfo, findClientInfoByEmail };
