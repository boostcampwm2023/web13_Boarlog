import { ApiProperty } from '@nestjs/swagger';

export class LectureInfoDto {
  @ApiProperty({ example: '강의 제목' })
  title: string;

  @ApiProperty({ example: '강의 설명' })
  description: string;

  presenter: JSON;

  constructor({ title, description, presenter }) {
    this.title = title;
    this.description = description;
    this.presenter = presenter;
  }
}
