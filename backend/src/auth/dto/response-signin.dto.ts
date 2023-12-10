import { ApiProperty } from '@nestjs/swagger';

export class ResponseSignInDto {
  @ApiProperty()
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
