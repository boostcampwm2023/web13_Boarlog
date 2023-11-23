import { GenerateUtils } from '../utils/GenerateUtils';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from './room.schema';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  private readonly currentRoomCode;

  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {
    // TODO: 현재 사용 중인 방 코드를 Redis 같은 곳에서 관리 필요
    this.currentRoomCode = new Set();
  }

  async create(createRoomDto: CreateRoomDto): Promise<void> {
    const createdRoom = new this.roomModel(createRoomDto);
    await createdRoom.save();
  }

  generateRoomCode(): string {
    const generateUtils = new GenerateUtils();
    let roomCode = generateUtils.generateRandomNumber();
    while (this.currentRoomCode.has(roomCode)) {
      roomCode = generateUtils.generateRandomNumber();
    }
    this.currentRoomCode.add(roomCode);
    return roomCode;
  }
}
