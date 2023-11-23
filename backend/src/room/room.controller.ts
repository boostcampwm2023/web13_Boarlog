import { Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { RoomService } from './room.service';
import { Response } from 'express';

@Controller('/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Res() res: Response) {
    const roomCode = this.roomService.createRoomCode();
    res.status(HttpStatus.CREATED).send({ code: roomCode });
  }
}
