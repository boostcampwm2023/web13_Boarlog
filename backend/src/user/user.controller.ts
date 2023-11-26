import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserInfoDto } from '../auth/dto/userInfo.dto';
import { UsernameUpdateDto } from './dto/username.update.dto';

@Controller('/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async profile(@Query('email') email: string, @Res() res: Response) {
    const userInfo = await this.userService.findOneByEmail(email);
    if (!userInfo) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    res.status(HttpStatus.OK).send(new UserInfoDto(userInfo));
  }

  @Post()
  async changeUsername(@Body() usernameUpdateDto: UsernameUpdateDto, @Res() res: Response) {
    const result = await this.userService.updateUsername(usernameUpdateDto);
    if (!result) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    res.status(HttpStatus.OK).send(new UserInfoDto(result));
  }
}
