import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Lecture {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, type: JSON })
  presenter: { username: string; email: string };

  @Prop({ default: false })
  is_end: boolean;

  @Prop()
  audio_file: string;

  @Prop()
  start_time: Date;
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);
