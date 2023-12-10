import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: JSON })
  lecture_id: { title: string; description: string; presenter: JSON };
}

export const UserSchema = SchemaFactory.createForClass(User);
