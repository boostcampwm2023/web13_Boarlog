import { RTCPeerConnection } from 'wrtc';

export class RoomInfo {
  private readonly _RTCPC: RTCPeerConnection;
  private readonly _presenterSocketId: string;
  private readonly _studentSocketList: Array<string>;
  private _stream: MediaStream | null;

  constructor(socketId: string, RTCPC: RTCPeerConnection) {
    this._presenterSocketId = socketId;
    this._studentSocketList = [];
    this._RTCPC = RTCPC;
    this._stream = null;
  }

  get presenterSocketId(): string {
    return this._presenterSocketId;
  }

  get studentSocketList(): Array<string> {
    return this._studentSocketList;
  }

  set stream(presenterStream: MediaStream) {
    this._stream = presenterStream;
  }

  get stream(): MediaStream | null {
    return this._stream;
  }
}
