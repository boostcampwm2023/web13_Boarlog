import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserInfoDto } from './dto/userInfo.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() userInfo: UserInfoDto) {
    return this.authService.signUp(userInfo);
  }

  @Get('/signin')
  @UseGuards(AuthGuard('google'))
  signIn() {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    res.send(req.user.jwt);
  }
}
