import { GenerateUtils } from '../utils/GenerateUtils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './room.schema';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { EnterCode } from './room-code.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<Room>,
    @InjectModel(EnterCode.name)
    private enterCodeModel: Model<EnterCode>,
    private readonly userService: UserService
  ) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const user = await this.userService.findOneByEmail(createRoomDto.email);
    const createdRoom = new this.roomModel({ ...createRoomDto, presenter_id: user.id });
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
