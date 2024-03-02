import { Server, Socket } from 'socket.io';
import { RoomConnectionInfo } from './models/RoomConnectionInfo';
import { ClientConnectionInfo } from './models/ClientConnectionInfo';

export class RelayServer {
  private readonly _io;
  private readonly _roomConnectionInfoList: Map<string, RoomConnectionInfo>;
  private readonly _clientConnectionInfoList: Map<string, ClientConnectionInfo>;
  private readonly _scheduledEndLectureList: Map<string, NodeJS.Timeout>;

  constructor(port: number) {
    this._roomConnectionInfoList = new Map();
    this._clientConnectionInfoList = new Map();
    this._scheduledEndLectureList = new Map();
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

  get roomConnectionInfoList() {
    return this._roomConnectionInfoList;
  }

  get clientConnectionInfoList() {
    return this._clientConnectionInfoList;
  }

  get scheduledEndLectureList() {
    return this._scheduledEndLectureList;
  }

  listen = (path: string, event: string, method: (socket: Socket) => void) => {
    this._io.of(path).on(event, method);
  };

  clearScheduledEndLecture = (roomId: string) => {
    const timerId = this._scheduledEndLectureList.get(roomId);
    if (!timerId) {
      console.log('이미 종료됐거나 열리지 않은 강의실입니다.');
      return;
    }
    clearTimeout(timerId);
    this._scheduledEndLectureList.delete(roomId);
  };
}
