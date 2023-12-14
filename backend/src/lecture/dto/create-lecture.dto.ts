import { ApiProperty } from '@nestjs/swagger';

export class CreateLectureDto {
  @ApiProperty({ example: '강의 제목' })
  title: string;

  @ApiProperty({ example: '이런이런 강의입니다' })
  description: string;
}
