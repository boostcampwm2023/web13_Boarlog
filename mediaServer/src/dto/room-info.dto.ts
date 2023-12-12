import { ICanvasData } from '../types/canvas-data.interface';

export class RoomInfoDto {
  presenterEmail: string;
  startTime: Date;
  currentWhiteboardData: string;

  constructor(presenterEmail: string, whiteboardData: ICanvasData) {
    this.presenterEmail = presenterEmail;
    this.startTime = new Date();
    this.currentWhiteboardData = JSON.stringify(whiteboardData);
  }
}
