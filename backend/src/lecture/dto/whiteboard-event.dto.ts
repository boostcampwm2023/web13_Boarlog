import { WhiteboardLog } from "../schema/whiteboard-log.schema";

export class WhiteboardEventDto {
  objects: Uint8Array;

  viewport: number[];

  eventTime: number;

  width: number;

  height: number;

  constructor(log: WhiteboardLog) {
    this.objects = new Uint8Array(log.objects);
    this.viewport = log.viewport;
    this.eventTime = log.eventTime;
    this.width = log.width;
    this.height = log.height;
  }
}
