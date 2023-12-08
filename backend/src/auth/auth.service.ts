import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { SignUpDto } from './dto/auth.signup.dto';
import { UserInfoDto } from './dto/userInfo.dto';
import { SignInDto } from './dto/auth.signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const user = new this.userModel(signUpDto);
    return await user.save();
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.findUser(signInDto.email);
    const validatedPassword = await bcrypt.compare(signInDto.password, user.password);
    if (!user || !validatedPassword) {
      throw new HttpException('해당 사용자가 없습니다.', HttpStatus.NOT_FOUND);
    }
    const userInfo = new UserInfoDto({ username: user.username, email: user.email });
    return await this.generateCookie(userInfo);
  }

  async findUser(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async generateCookie(userInfo: UserInfoDto) {
    const token = await this.jwtService.signAsync({ username: userInfo.username, email: userInfo.email });
    return token;
  }
}
