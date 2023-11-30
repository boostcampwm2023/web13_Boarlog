import { Lecture } from '../lecture.schema';

export class LectureInfoDto {
  code: string;
  title: string;
  description: string;

  static of(code: any, lecture: Lecture): LectureInfoDto {
    return {
      code: code,
      title: lecture.title,
      description: lecture.description
    };
  }
}
