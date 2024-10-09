import { forwardRef, Module } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { GamesService } from './games.service';
import { Game } from './game.entity';
import { GamesController } from './games.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRole } from './game-role.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  providers: [GamesService],
  controllers: [GamesController],
  imports: [
    TypeOrmModule.forFeature([Game, GameRole, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolesModule),
  ],
  exports: [TypeOrmModule, GamesService],
})
export class GamesModule {}
