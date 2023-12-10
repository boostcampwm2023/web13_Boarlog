import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class LectureInfoDto {
  @ApiProperty({ example: '강의 제목' })
  title: string;

  @ApiProperty({ example: '강의 설명' })
  description: string;

  presenter: mongoose.Types.ObjectId;

  constructor({ title, description, presenter }) {
    this.title = title;
    this.description = description;
    this.presenter = presenter;
  }
}
