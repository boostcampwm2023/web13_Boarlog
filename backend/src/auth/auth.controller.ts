import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CustomAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.signin.dto';
import { SignUpDto } from './dto/auth.signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: SignUpDto })
  signUp(@Body() signUpDto: SignUpDto) {
    const user = this.authService.findUser(signUpDto.email);
    if (user) {
      throw new HttpException('이미 가입되어 있는 사용자입니다.', HttpStatus.CONFLICT);
    }
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @ApiBody({ type: SignInDto })
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const user = this.authService.findUser(signInDto.email);
    if (!user) {
      throw new HttpException('해당 사용자가 없습니다.', HttpStatus.NOT_FOUND);
    }
    const result = await this.authService.signIn(signInDto);
    return res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(CustomAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
