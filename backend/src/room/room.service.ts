import { GenerateUtils } from '../utils/GenerateUtils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './room.schema';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { EnterCode } from './room-code.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,

    @InjectModel(EnterCode.name)
    private enterCodeModel: Model<EnterCode>
  ) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const createdRoom = new this.roomModel(createRoomDto);
    const createdEnterCode = new this.enterCodeModel({
      code: await this.generateRoomCode(),
      lecture_id: createdRoom.id
    });
    await Promise.all([createdRoom.save(), createdEnterCode.save()]);
    return createdEnterCode.code;
  }

  async generateRoomCode() {
    const generateUtils = new GenerateUtils();
    let roomCode = generateUtils.generateRandomNumber();
    while (await this.findRoomByCode(roomCode)) {
      roomCode = generateUtils.generateRandomNumber();
    }
    return roomCode;
  }

  async findRoomByCode(code: string) {
    return await this.enterCodeModel.findOne({ code: code });
  }
}
