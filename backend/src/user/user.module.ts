import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { LectureService } from 'src/lecture/lecture.service';
import { Lecture, LectureSchema } from 'src/lecture/schema/lecture.schema';
import { EnterCode, EnterCodeSchema } from 'src/lecture/schema/lecture-code.schema';
import { WhiteboardLog, WhiteboardLogSchema } from 'src/lecture/schema/whiteboard-log.schema';
import { LectureSubtitle, LectureSubtitleSchema } from 'src/lecture/lecture-subtitle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Lecture.name, schema: LectureSchema },
      { name: EnterCode.name, schema: EnterCodeSchema },
      { name: WhiteboardLog.name, schema: WhiteboardLogSchema },
      { name: LectureSubtitle.name, schema: LectureSubtitleSchema }
    ]),
    JwtModule
  ],
  controllers: [UserController],
  providers: [UserService, LectureService]
})
export class UserModule {}
