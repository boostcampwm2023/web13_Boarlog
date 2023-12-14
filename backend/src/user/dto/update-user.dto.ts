import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty({ example: 'EXAMPLE_USERNAME' })
  username: string;
}
