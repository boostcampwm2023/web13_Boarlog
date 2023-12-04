import { RTCPeerConnection } from 'wrtc';
import { Socket } from 'socket.io';

export enum ClientType {
  PRESENTER = 'PRESENTER',
  STUDENT = 'STUDENT'
}

export class ClientInfo {
  private readonly _type: ClientType;
  private readonly _RTCPC: RTCPeerConnection;
  private readonly _roomId: string;
  private _enterSocket: Socket | null;
  private _lectureSocket: Socket | null;

  constructor(type: ClientType, RTCPC: RTCPeerConnection, roomId: string) {
    this._type = type;
    this._RTCPC = RTCPC;
    this._roomId = roomId;
    this._enterSocket = null;
    this._lectureSocket = null;
  }

  get type(): ClientType {
    return this._type;
  }

  get RTCPC(): RTCPeerConnection {
    return this._RTCPC;
  }

  get roomId(): string {
    return this._roomId;
  }

  get enterSocket(): Socket | null {
    return this._enterSocket;
  }

  set enterSocket(socket: Socket) {
    this._enterSocket = socket;
  }

  get lectureSocket(): Socket | null {
    return this._lectureSocket;
  }

  set lectureSocket(socket: Socket) {
    this._lectureSocket = socket;
  }
}
