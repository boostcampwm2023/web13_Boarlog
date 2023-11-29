import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnterCode, EnterCodeSchema } from './lecture-code.schema';
import { LectureController } from './lecture.controller';
import { Lecture, LectureSchema } from './lecture.schema';
import { LectureService } from './lecture.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecture.name, schema: LectureSchema },
      { name: EnterCode.name, schema: EnterCodeSchema }
    ])
  ],
  controllers: [LectureController],
  providers: [LectureService]
})
export class LectureModule {}
