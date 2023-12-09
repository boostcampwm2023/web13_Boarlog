import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserInfoDto } from './dto/userInfo.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomAuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './dto/update-user.dto';

@ApiTags('profile')
@Controller('/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CustomAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  async profile(@Req() req: any, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('로그인 되지 않은 사용자입니다.', HttpStatus.UNAUTHORIZED);
    }
    const userInfo = await this.userService.findOneByEmail(req.user.email);
    if (!userInfo) {
      throw new HttpException('사용자 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }
    res.status(HttpStatus.OK).send(new UserInfoDto(userInfo));
  }

  @Post()
  @ApiOperation({ summary: 'Change username' })
  @ApiBody({
    description: 'Change username',
    type: UserUpdateDto
  })
  @ApiResponse({ type: UserInfoDto })
  async changeUsername(@Body() userUpdateDto: UserUpdateDto, @Res() res: Response) {
    const result = await this.userService.updateUsername(userUpdateDto);
    if (!result) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    res.status(HttpStatus.OK).send(new UserInfoDto(result));
  }
}
