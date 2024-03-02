import { relayServer } from '../main';

const sendDataToClient = (namespace: string, target: string, eventName: string, data: any) => {
  relayServer.socket.of(namespace).to(target).emit(eventName, data);
};

export { sendDataToClient };
