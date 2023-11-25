import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async updateUsername({ email, username }) {
    return await this.userModel.findOneAndUpdate({ email: email }, { username: username }, { new: true });
  }

  async updateLecture(email, lecture) {
    return await this.userModel.findOneAndUpdate({ email: email }, { lecture_id: lecture }, { new: true });
  }
}
