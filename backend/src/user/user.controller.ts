import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserInfoDto } from '../auth/dto/userInfo.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
