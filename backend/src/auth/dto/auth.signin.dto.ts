import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'password1234!' })
  password: string;

  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}
