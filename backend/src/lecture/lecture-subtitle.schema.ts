import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Lecture } from './schema/lecture.schema';

@Schema()
export class LectureSubtitle {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' })
  lecture_id: Lecture;

  @Prop({ required: true })
  subtitle: [{ start: string; text: string }];
}

export const LectureSubtitleSchema = SchemaFactory.createForClass(LectureSubtitle);
