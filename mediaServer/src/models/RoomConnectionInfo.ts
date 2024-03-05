import { RTCPeerConnection } from 'wrtc';
import { Socket } from 'socket.io';
import { relayServer } from '../main';

export class RoomConnectionInfo {
  private _presenterSocket: Socket | null;
  private readonly _presenterRTCPC: RTCPeerConnection;
  private readonly _participantIdList: Set<string>;
  private _stream: MediaStream | null;

  constructor(RTCPC: RTCPeerConnection) {
    this._presenterSocket = null;
    this._presenterRTCPC = RTCPC;
    this._participantIdList = new Set();
    this._stream = null;
  }

  set presenterSocket(socket: Socket) {
    this._presenterSocket = socket;
  }

  get participantIdList(): Set<string> {
    return this._participantIdList;
  }

  set stream(presenterStream: MediaStream) {
    this._stream = presenterStream;
  }

  get stream(): MediaStream | null {
    return this._stream;
  }

  closeParticipantConnection = (roomId: string) => {
    this._participantIdList.forEach((participantId: string) => {
      const participantConnectionInfo = relayServer.clientConnectionInfoList.get(participantId);
      if (participantConnectionInfo) {
        participantConnectionInfo.disconnectSocket(participantId, roomId);
        participantConnectionInfo.disconnectWebRTCConnection();
        relayServer.clientConnectionInfoList.delete(participantId);
      }
    });
  };

  exitRoom = (participantId: string, roomId: string) => {
    const participantConnectionInfo = relayServer.clientConnectionInfoList.get(participantId);
    if (participantConnectionInfo) {
      participantConnectionInfo.disconnectSocket(participantId, roomId);
      this._participantIdList.delete(participantId);
    }
  };
}
