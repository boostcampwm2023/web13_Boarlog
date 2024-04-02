import { WhiteboardLog } from "../schema/whiteboard-log.schema";

export class WhiteboardEventDto {
  objects: Uint8Array;

  viewport: number[];

  eventTime: number;

  width: number;

  height: number;
}
