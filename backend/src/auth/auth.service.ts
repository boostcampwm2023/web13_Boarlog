import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { UserInfoDto } from './dto/userInfo.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(userInfo: UserInfoDto): Promise<User> {
    const user = new this.userModel(userInfo);
    return await user.save();
  }

  async findUser(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async generateCookie(userInfo: UserInfoDto) {
    const token = await this.jwtService.signAsync(userInfo);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=3600`;
  }
}
