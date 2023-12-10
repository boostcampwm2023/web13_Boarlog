import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ example: 'EXAMPLE_USERNAME' })
  username: string;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty()
  password: string;

  lecture_id: { title: string; description: string; present: JSON }; //mongoose.Types.ObjectId;

  constructor({ username, email, lecture_id }) {
    this.username = username;
    this.email = email;
    this.lecture_id = lecture_id;
  }
}
