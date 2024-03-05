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

  set lectureSocket(socket: Socket) {
    this._lectureSocket = socket;
  }

  disconnectWebRTCConnection = () => {
    this._RTCPC.close();
  };

  disconnectSocket = (clientId: string, roomId: string) => {
    this._enterSocket?.leave(clientId);
    this._enterSocket?.disconnect();
    this._lectureSocket?.leave(roomId);
    this._lectureSocket?.disconnect();
  };
}
