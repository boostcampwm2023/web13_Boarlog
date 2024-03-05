import { Server, Socket } from 'socket.io';
import { RoomConnectionInfo } from './models/RoomConnectionInfo';
import { ClientConnectionInfo } from './models/ClientConnectionInfo';

export class RelayServer {
  private readonly _io;
  private readonly _roomConnectionInfoList: Map<string, RoomConnectionInfo>;
  private readonly _clientConnectionInfoList: Map<string, ClientConnectionInfo>;
  private readonly _scheduledEndLectureList: Map<string, number>;

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

  deleteRoom = (presenterEmail: string, roomId: string) => {
    const roomConnectionInfo = this._roomConnectionInfoList.get(roomId);
    if (!roomConnectionInfo) {
      console.log('존재하지 않는 방입니다.');
      return;
    }
    roomConnectionInfo.closeParticipantConnection(roomId);
    this._roomConnectionInfoList.delete(roomId);
    const presenterConnectionInfo = this._clientConnectionInfoList.get(presenterEmail);
    if (!presenterConnectionInfo) {
      console.log('존재하지 않는 발표자입니다.');
      return;
    }
    presenterConnectionInfo.disconnectWebRTCConnection();
    presenterConnectionInfo.disconnectSocket(presenterEmail, roomId);
    this._clientConnectionInfoList.delete(presenterEmail);
    this._scheduledEndLectureList.delete(roomId);
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
