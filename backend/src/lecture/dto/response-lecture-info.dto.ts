import { ApiProperty } from '@nestjs/swagger';
import { Lecture } from '../lecture.schema';

export class LectureInfoDto {
  @ApiProperty({ example: '강의 제목' })
  title: string;

  @ApiProperty({ example: '강의 설명' })
  description: string;

  static of(lecture: Lecture): LectureInfoDto {
    return {
      title: lecture.title,
      description: lecture.description
    };
  }
}
