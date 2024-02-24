import { RTCPeerConnection } from 'wrtc';
import { Socket } from 'socket.io';

export class ClientConnectionInfo {
  private readonly _RTCPC: RTCPeerConnection;
  private _enterSocket: Socket | null;
  private _lectureSocket: Socket | null;

  constructor(RTCPC: RTCPeerConnection, enterSocket?: Socket) {
    this._RTCPC = RTCPC;
    this._enterSocket = enterSocket ?? null;
    this._lectureSocket = null;
  }

  get RTCPC(): RTCPeerConnection {
    return this._RTCPC;
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
