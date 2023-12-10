import { ClientType } from '../constants/client-type.constant';

export class ClientInfoDto {
  type: ClientType;
  roomId: string;

  constructor(type: ClientType, roomId: string) {
    this.type = type;
    this.roomId = roomId;
  }
}
