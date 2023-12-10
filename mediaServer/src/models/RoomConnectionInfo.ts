import { RTCPeerConnection } from 'wrtc';
import { Socket } from 'socket.io';
import { ClientConnectionInfo } from './ClientConnectionInfo';

export class RoomConnectionInfo {
  private _presenterSocket: Socket | null;
  private readonly _presenterRTCPC: RTCPeerConnection;
  private readonly _studentInfoList: Set<ClientConnectionInfo>;
  private _stream: MediaStream | null;

  constructor(RTCPC: RTCPeerConnection) {
    this._presenterSocket = null;
    this._presenterRTCPC = RTCPC;
    this._studentInfoList = new Set();
    this._stream = null;
  }

  set presenterSocket(socket: Socket) {
    this._presenterSocket = socket;
  }

  get studentInfoList(): Set<ClientConnectionInfo> {
    return this._studentInfoList;
  }

  set stream(presenterStream: MediaStream) {
    this._stream = presenterStream;
  }

  get stream(): MediaStream | null {
    return this._stream;
  }

  endLecture = (roomId: string) => {
    this._presenterRTCPC.close();
    this._studentInfoList.forEach((studentInfo: ClientConnectionInfo) => {
      studentInfo.enterSocket?.leave(roomId);
      studentInfo.enterSocket?.disconnect();
      studentInfo.lectureSocket?.leave(roomId);
      studentInfo.lectureSocket?.disconnect();
      studentInfo.RTCPC?.close();
    });
  };

  exitRoom = (clientInfo: ClientConnectionInfo, roomId: string) => {
    clientInfo.lectureSocket?.leave(roomId);
    this._studentInfoList.delete(clientInfo);
  };
}
