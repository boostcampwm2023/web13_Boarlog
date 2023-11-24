import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './lecture.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }])]
})
export class LectureModule {}
