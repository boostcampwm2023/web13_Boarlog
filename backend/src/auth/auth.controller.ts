import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ResponseSignInDto } from './dto/response-signin.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 409, description: '이미 가입되어 있는 사용자입니다.' })
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.findUserByEmail(signUpDto.email);
    if (user) {
      throw new HttpException('이미 가입되어 있는 사용자입니다.', HttpStatus.CONFLICT);
    }
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인 API' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, type: ResponseSignInDto })
  @ApiResponse({ status: 404, description: '해당 사용자가 없습니다.' })
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const user = this.authService.findUserByEmail(signInDto.email);
    if (!user) {
      throw new HttpException('해당 사용자가 없습니다.', HttpStatus.NOT_FOUND);
    }
    const result = await this.authService.signIn(signInDto);
    return res.status(HttpStatus.OK).send(new ResponseSignInDto(result));
  }
}
