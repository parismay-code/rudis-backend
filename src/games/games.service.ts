import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Game } from './game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { GameRole } from './game-role.entity';
import { CreateGameRoleDto } from './dto/create-game-role.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gamesRepository: Repository<Game>,
    @InjectRepository(GameRole)
    private readonly gamesRolesRepository: Repository<GameRole>,
  ) {}

  private async createGameRole(data: CreateGameRoleDto) {
    const role = this.gamesRolesRepository.create(data);

    return await this.gamesRolesRepository.save(role);
  }

  private async createGameRoles(game: Game, data: CreateGameRoleDto[]) {
    for (const roleData of data) {
      if (roleData.gameId !== game.id) {
        continue;
      }

      const role = await this.createGameRole(roleData);

      game.roles.push(role);
    }
  }

  async createGame(data: CreateGameDto) {
    const game = this.gamesRepository.create(data);

    await this.createGameRoles(game, data.roles);

    return await this.gamesRepository.save(game);
  }

  async updateGame(id: number, data: CreateGameDto) {
    const game = await this.getGameById(id);

    Object.assign(game, data);

    await this.gamesRolesRepository.remove(game.roles);
    game.roles = [];

    await this.createGameRoles(game, data.roles);

    return await this.gamesRepository.save(game);
  }

  async getAllGames() {
    return await this.gamesRepository.find({
      relations: { rooms: true, roles: true },
    });
  }

  async getGameById(id: number) {
    const game = await this.gamesRepository.findOne({
      where: { id: Equal(id) },
      relations: { rooms: true, roles: true },
    });

    if (!game) {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }

    return game;
  }

  async deleteGame(id: number) {
    const game = await this.getGameById(id);

    await this.gamesRepository.delete(game.id);

    return game;
  }
}
