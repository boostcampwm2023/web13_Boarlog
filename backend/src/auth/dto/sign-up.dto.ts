import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'nickname' })
  username: string;

  @ApiProperty({ example: 'password1234!' })
  password: string;
}
