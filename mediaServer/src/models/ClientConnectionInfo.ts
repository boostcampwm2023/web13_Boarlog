import { RTCPeerConnection } from 'wrtc';
import { Socket } from 'socket.io';
import { ClientStatus } from '../constants/client-status.constant';

export class ClientConnectionInfo {
  private _RTCPC: RTCPeerConnection;
  private _enterSocket: Socket | null;
  private _lectureSocket: Socket | null;
  private _status: ClientStatus;

  constructor(RTCPC: RTCPeerConnection, enterSocket?: Socket) {
    this._RTCPC = RTCPC;
    this._enterSocket = enterSocket ?? null;
    this._lectureSocket = null;
    this._status = ClientStatus.ONLINE;
  }

  get RTCPC(): RTCPeerConnection {
    return this._RTCPC;
  }

  get status() {
    return this._status;
  }

  set lectureSocket(socket: Socket) {
    this._lectureSocket = socket;
  }

  updateConnection = (RTCPC: RTCPeerConnection, socket: Socket) => {
    this._RTCPC = RTCPC;
    this._enterSocket = socket;
  };

  disconnectWebRTCConnection = () => {
    this._RTCPC.close();
  };

  disconnectSocket = (clientId: string, roomId: string) => {
    this._enterSocket?.leave(clientId);
    this._enterSocket?.disconnect();
    this._lectureSocket?.leave(roomId);
    this._lectureSocket?.disconnect();
  };

  setOfflineStatus = () => {
    this._status = ClientStatus.OFFLINE;
  };

  setOnlineStatus = () => {
    this._status = ClientStatus.ONLINE;
  };
}
