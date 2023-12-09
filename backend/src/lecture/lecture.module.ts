import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { LectureSubtitle, LectureSubtitleSchema } from './lecture-subtitle.schema';
import { LectureController } from './lecture.controller';
import { Lecture, LectureSchema } from './schema/lecture.schema';
import { LectureService } from './lecture.service';
import { WhiteboardLog, WhiteboardLogSchema } from './schema/whiteboard-log.schema';
import { EnterCode, EnterCodeSchema } from './schema/lecture-code.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecture.name, schema: LectureSchema },
      { name: EnterCode.name, schema: EnterCodeSchema },
      { name: User.name, schema: UserSchema },
      { name: WhiteboardLog.name, schema: WhiteboardLogSchema },
      { name: LectureSubtitle.name, schema: LectureSubtitleSchema }
    ]),
    JwtModule
  ],
  controllers: [LectureController],
  providers: [LectureService, UserService]
})
export class LectureModule {}
