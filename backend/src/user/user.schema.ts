import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Lecture } from '../lecture/schema/lecture.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  profile: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }] })
  lecture_id: Lecture[];
}

export const UserSchema = SchemaFactory.createForClass(User);
