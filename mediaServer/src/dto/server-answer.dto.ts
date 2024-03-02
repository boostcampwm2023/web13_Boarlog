export class ServerAnswerDto {
  whiteboard: Record<string, string>;
  startTime: string;
  SDP: RTCSessionDescriptionInit;

  constructor(whiteboard: Record<string, string>, startTime: string, SDP: RTCSessionDescriptionInit) {
    this.whiteboard = whiteboard;
    this.startTime = startTime;
    this.SDP = SDP;
  }
}
