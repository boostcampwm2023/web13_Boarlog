import mongoose from 'mongoose';

export class UserInfoDto {
  username: string;
  email: string;
  profile: string;
  lecture_id: mongoose.Types.ObjectId;

  constructor({ username, email, profile, lecture_id }) {
    this.username = username;
    this.email = email;
    this.profile = profile;
    this.lecture_id = lecture_id;
  }

  static of(user: any): any {
    return {
      username: user.username,
      email: user.email,
      profile: user.profile
    };
  }
}
