import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { RoomService } from './room.service';
import { Response } from 'express';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto, @Res() res: Response) {
    this.roomService.create(createRoomDto);
    res.status(HttpStatus.CREATED).send({ code: this.roomService.generateRoomCode() });
  }
}
