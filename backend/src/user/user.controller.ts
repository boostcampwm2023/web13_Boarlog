import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserInfoDto } from './dto/userInfo.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomAuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './dto/update-user.dto';

@ApiTags('profile')
@Controller('/profile')
@ApiHeader({ name: 'Authorization' })
@UseGuards(CustomAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  async profile(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('로그인 되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);
    }
    const userInfo = await this.userService.findOneByEmail(req.user.email);
    res.status(HttpStatus.OK).send(new UserInfoDto(userInfo));
  }

  @Post()
  @ApiOperation({ summary: 'Change username' })
  @ApiBody({
    description: 'Change username',
    type: UserUpdateDto
  })
  @ApiResponse({ type: UserInfoDto })
  async changeUsername(@Req() req: any, @Body() userUpdateDto: UserUpdateDto, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('로그인 되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);
    }
    const result = await this.userService.updateUsername(req.user.email, userUpdateDto.username);
    res.status(HttpStatus.OK).send(new UserInfoDto(result));
  }
}
