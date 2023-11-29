import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { EnterCode, EnterCodeSchema } from './lecture-code.schema';
import { LectureController } from './lecture.controller';
import { Lecture, LectureSchema } from './lecture.schema';
import { LectureService } from './lecture.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecture.name, schema: LectureSchema },
      { name: EnterCode.name, schema: EnterCodeSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [LectureController],
  providers: [LectureService, UserService]
})
export class LectureModule {}
