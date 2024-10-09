import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { User } from 'src/users/user.entity';
import { Role } from 'src/roles/role.entity';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { Game } from '../games/game.entity';
import { GamesModule } from '../games/games.module';
import { Room } from '../rooms/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User, Role, Game, Room]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolesModule),
    forwardRef(() => GamesModule),
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
