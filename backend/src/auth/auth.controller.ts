import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CustomAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/auth.signup.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: SignUpDto })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('/signin')
  @UseGuards(AuthGuard('google'))
  signIn() {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const cookie = req.user.cookie;
    res.setHeader('Set-Cookie', cookie);
    res.redirect('/');
    return res.send();
  }

  @ApiCookieAuth()
  @UseGuards(CustomAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('logout')
  @ApiResponse({ status: 200 })
  logout(@Res() res: Response) {
    res.setHeader(`Set-Cookie`, `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    return res.sendStatus(200);
  }
}
