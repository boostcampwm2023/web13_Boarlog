import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UserInfoDto {
  @ApiProperty({ example: 'EXAMPLE_USERNAME' })
  username: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty()
  password: string;

  lecture_id: mongoose.Types.ObjectId;

  constructor({ username, email, lecture_id }) {
    this.username = username;
    this.email = email;
    this.lecture_id = lecture_id;
  }
}
