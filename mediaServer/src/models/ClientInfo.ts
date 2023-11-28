import { RTCPeerConnection } from 'wrtc';

export enum ClientType {
  PRESENTER,
  STUDENT
}

export class ClientInfo {
  private readonly _type: ClientType;
  private readonly _RTCPC: RTCPeerConnection;
  private _roomId: string;

  constructor(type: ClientType, RTCPC: RTCPeerConnection) {
    this._type = type;
    this._RTCPC = RTCPC;
    this._roomId = '';
  }

  get type(): ClientType {
    return this._type;
  }

  get RTCPC(): RTCPeerConnection {
    return this._RTCPC;
  }

  set roomId(roomId: string) {
    this._roomId = roomId;
  }
}
