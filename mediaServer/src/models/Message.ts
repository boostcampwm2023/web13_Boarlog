import { ICanvasData } from '../types/canvas-data.interface';

export class Message {
  type: string;
  content: string | ICanvasData;

  constructor(type: string, content: string | ICanvasData) {
    this.type = type;
    this.content = content;
  }
}
