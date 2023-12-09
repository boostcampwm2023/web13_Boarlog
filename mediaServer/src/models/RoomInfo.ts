import { RTCPeerConnection } from 'wrtc';
import { Socket } from 'socket.io';
import { ClientInfo } from './ClientInfo';

interface ICanvasData {
  canvasJSON: string;
  viewport: number[];
  eventTime: number;
  width: number;
  height: number;
}

export class RoomInfo {
  private readonly _roomId: string;
  private _presenterSocket: Socket | null;
  private readonly _presenterEmail: string;
  private readonly _presenterRTCPC: RTCPeerConnection;
  private readonly _studentInfoList: Set<ClientInfo>;
  private readonly _startTime: Date;
  private _stream: MediaStream | null;
  private _currentWhiteboardData: ICanvasData | null;

  constructor(roomId: string, email: string, RTCPC: RTCPeerConnection) {
    this._roomId = roomId;
    this._presenterSocket = null;
    this._presenterEmail = email;
    this._presenterRTCPC = RTCPC;
    this._studentInfoList = new Set();
    this._startTime = new Date();
    this._stream = null;
    this._currentWhiteboardData = null;
  }

  get presenterEmail(): string {
    return this._presenterEmail;
  }

  set presenterSocket(socket: Socket) {
    this._presenterSocket = socket;
  }

  get studentInfoList(): Set<ClientInfo> {
    return this._studentInfoList;
  }

  get startTime() {
    return this._startTime;
  }

  set stream(presenterStream: MediaStream) {
    this._stream = presenterStream;
  }

  get stream(): MediaStream | null {
    return this._stream;
  }

  get currentWhiteboardData(): ICanvasData | null {
    return this._currentWhiteboardData;
  }

  set currentWhiteboardData(data: ICanvasData) {
    this._currentWhiteboardData = data;
  }

  endLecture = () => {
    this._presenterRTCPC.close();
    this._studentInfoList.forEach((studentInfo: ClientInfo) => {
      studentInfo.enterSocket?.leave(this._roomId);
      studentInfo.enterSocket?.disconnect();
      studentInfo.lectureSocket?.leave(this._roomId);
      studentInfo.lectureSocket?.disconnect();
      studentInfo.RTCPC?.close();
    });
  };

  exitRoom = (clientInfo: ClientInfo) => {
    clientInfo.lectureSocket?.leave(this._roomId);
    this._studentInfoList.delete(clientInfo);
  };
}
