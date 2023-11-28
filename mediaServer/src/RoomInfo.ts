import { RTCPeerConnection } from 'wrtc';

export class RoomInfo {
  private readonly _RTCPC: RTCPeerConnection;
  private readonly _socketId: string;
  private _stream: MediaStream | null;

  constructor(socketId: string, RTCPC: RTCPeerConnection) {
    this._socketId = socketId;
    this._RTCPC = RTCPC;
    this._stream = null;
  }

  get socketId(): string {
    return this._socketId;
  }

  set stream(presenterStream: MediaStream) {
    this._stream = presenterStream;
  }

  get stream(): MediaStream | null {
    return this._stream;
  }
}
