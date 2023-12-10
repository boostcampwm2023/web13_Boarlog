import { ICanvasData } from '../interfaces/canvas-data.interface';

export class RoomInfoDto {
  presenterEmail: string;
  startTime: Date;
  currentWhiteboardData: ICanvasData | null;

  constructor(presenterEmail: string) {
    this.presenterEmail = presenterEmail;
    this.startTime = new Date();
    this.currentWhiteboardData = null;
  }
}
