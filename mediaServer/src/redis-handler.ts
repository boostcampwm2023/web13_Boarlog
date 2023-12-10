import { redis } from './config/redis.config';
import { ICanvasData } from './interfaces/canvas-data.interface';

const saveWhiteboardLog = async (roomId: string, canvasData: ICanvasData) => {
  await redis.xadd(`${roomId}-whiteboard`, '*', 'content', JSON.stringify(canvasData));
};

const findWhiteboardLog = async (roomId: string) => {
  const whiteboardLog = redis.xrange(`${roomId}-whiteboard`, '+', '-', 'COUNT', 1);
  console.log(whiteboardLog);
};

const saveQuestion = async (roomId: string, content: string) => {
  await redis.xadd(`${roomId}-question`, '*', 'content', content);
};

const deleteStream = async (streamKey: string) => {
  await redis.del(streamKey);
};

export { saveWhiteboardLog, findWhiteboardLog, saveQuestion, deleteStream };
