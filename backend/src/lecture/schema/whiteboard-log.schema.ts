import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lecture } from './lecture.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type WhiteBoardLogDocument = HydratedDocument<WhiteboardLog>;

@Schema()
export class WhiteboardLog {
  @Prop({ required: true })
  canvasJSON: string;

  @Prop({ required: true })
  viewPort: number[];

  @Prop({ required: true })
  eventDate: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' })
  lecture_id: Lecture;
}

export const WhiteboardLogSchema = SchemaFactory.createForClass(WhiteboardLog);
