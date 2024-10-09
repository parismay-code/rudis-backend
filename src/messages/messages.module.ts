import { forwardRef, Module } from '@nestjs/common';
import { User } from '../users/user.entity';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RoomsModule } from '../rooms/rooms.module';
import { Room } from '../rooms/room.entity';

@Module({
  providers: [MessagesService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([Message, Room, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => RoomsModule),
  ],
  exports: [TypeOrmModule, MessagesService],
})
export class MessagesModule {}
