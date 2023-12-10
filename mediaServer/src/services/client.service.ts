import { redis } from '../config/redis.config';
import { CLIENT_INFO_KEY_PREFIX } from '../constants/redis-key.constant';
import { ClientType } from '../constants/client-type.constant';
import { ClientInfoDto } from '../dto/client-info.dto';

const findClientInfoByEmail = async (email: string) => {
  const key = CLIENT_INFO_KEY_PREFIX + email;
  return await redis.hgetall(key);
};

const saveClientInfo = async (email: string, clientType: ClientType, roomId: string) => {
  const key = CLIENT_INFO_KEY_PREFIX + email;
  await redis.hset(key, new ClientInfoDto(clientType, roomId));
};

export { findClientInfoByEmail, saveClientInfo };
