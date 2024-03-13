import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email: email });
  }

  async updateUsername(email: string, username: string) {
    return await this.userModel.findOneAndUpdate({ email: email }, { username: username }, { new: true });
  }

  async findLectureList(email: string) {
    return (
      await (
        await this.findOneByEmail(email)
      ).populate({
        path: 'lecture_id',
        select: '-__v',
        match: { is_end: true },
        populate: { path: 'presenter_id', select: '-_id username' }
      })
    ).lecture_id;
  }

  async updateLectureList(email: string, id: Types.ObjectId) {
    return await this.userModel.findOneAndUpdate(
      { email: email },
      { $push: { lecture_id: id } },
      { new: true }
    ); 
  }
}
