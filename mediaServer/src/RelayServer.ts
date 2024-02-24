import { Server, Socket } from 'socket.io';
import { RoomConnectionInfo } from './models/RoomConnectionInfo';
import { ClientConnectionInfo } from './models/ClientConnectionInfo';

export class RelayServer {
  private readonly _io;
  private readonly _roomsConnectionInfo: Map<string, RoomConnectionInfo>;
  private readonly _clientsConnectionInfo: Map<string, ClientConnectionInfo>;

  constructor(port: number) {
    this._roomsConnectionInfo = new Map();
    this._clientsConnectionInfo = new Map();
    this._io = new Server(port, {
      cors: {
        // TODO: 특정 URL만 origin 하도록 수정 필요
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
  }

  get socket() {
    return this._io;
  }

  get roomsConnectionInfo() {
    return this._roomsConnectionInfo;
  }

  get clientsConnectionInfo() {
    return this._clientsConnectionInfo;
  }

  listen = (path: string, event: string, method: (socket: Socket) => void) => {
    this._io.of(path).on(event, method);
  };
}
