import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Lecture } from './lecture.schema';

@Schema()
export class EnterCode {
  @Prop({ required: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' })
  lecture_id: Lecture;
}

export const EnterCodeSchema = SchemaFactory.createForClass(EnterCode);
