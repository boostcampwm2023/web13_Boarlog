import { ApiProperty } from '@nestjs/swagger';

export class CreateLectureDto {
  @ApiProperty({ example: '강의 제목' })
  title: string;

  @ApiProperty({ example: '이런이런 강의입니다' })
  description: string;

  @ApiProperty({ description: '강의를 만든 발표자 email', example: 'example@gmail.com' })
  email: string;
}
