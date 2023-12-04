import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class UserInfoDto {
  @ApiProperty({ example: 'EXAMPLE_USERNAME' })
  username: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'PROFILE_URL' })
  profile: string;

  lecture_id: mongoose.Types.ObjectId;

  constructor({ username, email, profile, lecture_id }) {
    this.username = username;
    this.email = email;
    this.profile = profile;
    this.lecture_id = lecture_id;
  }

  static of(user: any): any {
    return {
      username: user.username,
      email: user.email,
      profile: user.profile
    };
  }
}
