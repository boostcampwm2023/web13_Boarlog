import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'EXAMPLE_USERNAME' })
  username: string;
}
