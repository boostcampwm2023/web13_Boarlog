import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lecture } from './lecture.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type WhiteBoardLogDocument = HydratedDocument<WhiteboardLog>;

@Schema()
export class WhiteboardLog {
  @Prop({ required: true })
  objects: Uint8Array;

  @Prop({ required: true })
  viewport: number[];

  @Prop({ required: true })
  eventTime: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' })
  lecture_id: Lecture;
}

export const WhiteboardLogSchema = SchemaFactory.createForClass(WhiteboardLog);
