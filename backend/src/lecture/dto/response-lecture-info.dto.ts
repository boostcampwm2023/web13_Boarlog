import { Lecture } from '../lecture.schema';

export class LectureInfoDto {
  title: string;
  description: string;

  static of(lecture: Lecture): LectureInfoDto {
    return {
      title: lecture.title,
      description: lecture.description
    };
  }
}
