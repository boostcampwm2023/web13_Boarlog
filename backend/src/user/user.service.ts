import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async findOneByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('사용자 정보가 존재하지 않습니다.');
    }
    return await this.userModel.findOne({ email: email });
  }

  async updateUsername(email: string, username: string) {
    const user = await this.userModel.findOneAndUpdate({ email: email }, { username: username }, { new: true });
    if (!user) {
      throw new NotFoundException('업데이트에 실패했습니다.');
    }
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
