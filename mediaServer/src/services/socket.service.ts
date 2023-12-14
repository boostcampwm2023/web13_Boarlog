import { relayServer } from '../main';
import { EntryRaw } from '../types/redis-stream.type';

const sendMessageUsingSocket = (
  namespace: string,
  target: string,
  eventName: string,
  data: Record<string, string | Array<EntryRaw>>
) => {
  relayServer.socket.of(namespace).to(target).emit(eventName, data);
};

export { sendMessageUsingSocket };
