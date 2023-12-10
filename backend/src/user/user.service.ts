import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { LectureService } from 'src/lecture/lecture.service';
import { EnterCode } from 'src/lecture/schema/lecture-code.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private lectureService: LectureService
  ) {}

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email });
  }

  async updateUsername(email: string, username: string) {
    return await this.userModel.findOneAndUpdate({ email: email }, { username: username }, { new: true });
  }

  async updateLecture(email: string, enterCode: EnterCode) {
    const lecture = await this.lectureService.findLectureInfo(enterCode);
    return await this.userModel.findOneAndUpdate(
      { email: email },
      { $push: { lecture_id: lecture.id } },
      { new: true }
    );
  }
}
