import { redis } from '../config/redis.config';
import { GROUP_NAME_SUFFIX, QUESTION_KEY_PREFIX } from '../constants/redis-key.constant';
import { StreamReadRaw } from '../types/redis-stream.type';

const setQuestionStreamAndGroup = async (roomId: string) => {
  redis.xgroup('CREATE', QUESTION_KEY_PREFIX + roomId, roomId + GROUP_NAME_SUFFIX, '$', 'MKSTREAM');
};

const isQuestionStreamExisted = async (roomId: string) => {
  return (await redis.exists(QUESTION_KEY_PREFIX + roomId)) === 1;
};

const findQuestionStreamById = async (roomId: string) => {
  return await redis.xinfo('STREAM', QUESTION_KEY_PREFIX + roomId);
};

const saveQuestion = async (roomId: string, content: string) => {
  await redis.xadd(QUESTION_KEY_PREFIX + roomId, '*', 'content', content);
};

const findQuestion = async (roomId: string, email: string) => {
  return redis.xreadgroup(
    'GROUP',
    roomId + GROUP_NAME_SUFFIX,
    email,
    'COUNT',
    1,
    'STREAMS',
    QUESTION_KEY_PREFIX + roomId,
    '>'
  );
};

const findUnsolvedQuestions = async (roomId: string, email: string) => {
  return await redis.xreadgroup('GROUP', roomId + GROUP_NAME_SUFFIX, email, 'STREAMS', QUESTION_KEY_PREFIX + roomId, 0);
};

const getStreamKeyAndQuestionFromStream = (stream: StreamReadRaw) => {
  const streamData = stream[0][1][0];
  return {
    streamKey: streamData[0],
    content: streamData[1][1]
  };
};

const updateQuestionStatus = async (roomId: string, questionId: string) => {
  redis.xack(QUESTION_KEY_PREFIX + roomId, roomId + GROUP_NAME_SUFFIX, questionId);
};

const deleteQuestionStream = async (roomId: string) => {
  await redis.del(QUESTION_KEY_PREFIX + roomId);
};

export {
  setQuestionStreamAndGroup,
  isQuestionStreamExisted,
  findQuestionStreamById,
  saveQuestion,
  findQuestion,
  findUnsolvedQuestions,
  getStreamKeyAndQuestionFromStream,
  updateQuestionStatus,
  deleteQuestionStream
};
