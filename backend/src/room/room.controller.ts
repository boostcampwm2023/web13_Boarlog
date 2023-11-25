import { Body, Controller, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { RoomService } from './room.service';
import { Response } from 'express';
import { CreateRoomDto } from './dto/create-room.dto';
import { EnterRoomDto } from './dto/enter-room.dto';
import { UserService } from '../user/user.service';

@Controller('/room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userService: UserService
  ) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto, @Res() res: Response) {
    const code = await this.roomService.createRoom(createRoomDto);
    res.status(HttpStatus.CREATED).send({ code: code });
  }

  @Patch('/:code')
  async enter(@Param('code') code: string, @Body() enterRoomDto: EnterRoomDto, @Res() res: Response) {
    const enterCodeDocument = await this.roomService.findRoomByCode(code);
    if (!enterCodeDocument) {
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    await this.userService.updateLecture(enterRoomDto.email, enterCodeDocument.lecture_id);
    res.status(HttpStatus.OK).send();
  }
}
