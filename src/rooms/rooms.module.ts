import { forwardRef, Module } from '@nestjs/common';
import { User } from '../users/user.entity';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { RoomsController } from './rooms.controller';
import { Room } from './room.entity';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [RoomsService, RoomsGateway],
  controllers: [RoomsController],
  imports: [
    TypeOrmModule.forFeature([Room, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  exports: [TypeOrmModule, RoomsService, RoomsGateway],
})
export class RoomsModule {}
