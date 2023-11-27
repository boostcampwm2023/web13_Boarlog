import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { EnterCode, EnterCodeSchema } from './room-code.schema';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: EnterCode.name, schema: EnterCodeSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [RoomController],
  providers: [RoomService, UserService]
})
export class RoomModule {}
