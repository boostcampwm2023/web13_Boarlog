import { GenerateUtils } from '../utils/GenerateUtils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private readonly currentRoomCode;

  constructor() {
    // TODO: 현재 사용 중인 방 코드를 Redis 같은 곳에서 관리 필요
    this.currentRoomCode = new Set();
  }

  createRoomCode(): string {
    const generateUtils = new GenerateUtils();
    let roomCode = generateUtils.generateRandomNumber();
    while (this.currentRoomCode.has(roomCode)) {
      roomCode = generateUtils.generateRandomNumber();
    }
    return this.currentRoomCode.add(roomCode);
  }
}
