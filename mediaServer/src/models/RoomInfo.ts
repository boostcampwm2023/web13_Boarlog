import { RTCPeerConnection } from 'wrtc';
import { Socket } from 'socket.io';

export class RoomInfo {
  private readonly _roomId: string;
  private readonly _RTCPC: RTCPeerConnection;
  private readonly _presenterSocket: Socket;
  private readonly _studentSocketList: Set<Socket>;
  private _stream: MediaStream | null;

  constructor(roomId: string, socket: Socket, RTCPC: RTCPeerConnection) {
    this._roomId = roomId;
    this._presenterSocket = socket;
    this._studentSocketList = new Set();
    this._RTCPC = RTCPC;
    this._stream = null;
  }

  get presenterSocket(): Socket {
    return this._presenterSocket;
  }

  get studentSocketList(): Set<Socket> {
    return this._studentSocketList;
  }

  set stream(presenterStream: MediaStream) {
    this._stream = presenterStream;
  }

  get stream(): MediaStream | null {
    return this._stream;
  }

  endLecture = () => {
    this._studentSocketList.forEach((student: Socket) => {
      student.leave(this._roomId);
    });
    this._presenterSocket.leave(this._roomId);
  };

  exitRoom = (studentSocket: Socket) => {
    studentSocket.leave(this._roomId);
    this._studentSocketList.delete(studentSocket);
  };
}
