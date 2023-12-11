import { ApiProperty } from '@nestjs/swagger';

export class ResponseSignInDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  constructor(token: string, email: string, username: string) {
    this.token = token;
    this.email = email;
    this.username = username;
  }
}
