import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ConfigService } from '@nestjs/config';
import { decryptPassword, encryptPassword } from 'src/utils/GenerateUtils';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResponseSignInDto } from './dto/response-signin.dto';

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

  async signIn(signInDto: SignInDto): Promise<ResponseSignInDto> {
    const user = await this.findUserByEmail(signInDto.email);
    if (!user) {
      throw new HttpException('해당 사용자가 없습니다.', HttpStatus.NOT_FOUND);
    }

    const validatedPassword = await decryptPassword(signInDto.password, user?.password);
    if (!validatedPassword) {
      throw new HttpException('해당 사용자가 없습니다.', HttpStatus.NOT_FOUND);
    }
    const token = await this.generateCookie({ username: user.username, email: user.email });
    return new ResponseSignInDto(token, user.email, user.username);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async generateCookie(userInfo: any) {
    const token = await this.jwtService.signAsync({ username: userInfo.username, email: userInfo.email });
    return token;
  }
}
