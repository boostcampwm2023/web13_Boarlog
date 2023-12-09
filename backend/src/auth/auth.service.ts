import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { SignUpDto } from './dto/auth.signup.dto';
import { SignInDto } from './dto/auth.signin.dto';
import { ConfigService } from '@nestjs/config';
import { decryptPassword, encryptPassword } from 'src/utils/GenerateUtils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUp(signUpDto: SignUpDto) {
    signUpDto.password = await encryptPassword(signUpDto.password);
    const user = await new this.userModel(signUpDto).save();
    return { username: user.username, email: user.email };
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.findUserByEmail(signInDto.email);
    const validatedPassword = await decryptPassword(signInDto.password, user.password);
    if (!user || !validatedPassword) {
      throw new HttpException('해당 사용자가 없습니다.', HttpStatus.NOT_FOUND);
    }

    return await this.generateCookie({ username: user.username, email: user.email });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async generateCookie(userInfo: any) {
    const token = await this.jwtService.signAsync({ username: userInfo.username, email: userInfo.email });
    return token;
  }
}
