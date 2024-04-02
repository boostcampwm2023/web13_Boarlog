import { RoomInfoResponseDto } from './room-info-response.dto';

export class ServerAnswerDto {
  whiteboard: Record<string, string | Buffer>;
  startTime: string;
  SDP: RTCSessionDescriptionInit;

  constructor(roomInfo: RoomInfoResponseDto, SDP: RTCSessionDescriptionInit) {
    this.whiteboard = roomInfo.currentWhiteboardData;
    this.startTime = roomInfo.startTime;
    this.SDP = SDP;
  }
}
