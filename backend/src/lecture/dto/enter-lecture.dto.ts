import { ApiProperty } from '@nestjs/swagger';

export class EnterLectureDto {
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;
}
