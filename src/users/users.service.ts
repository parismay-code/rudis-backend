import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SetRoleDto } from 'src/users/dto/set-role.dto';
import { BanUserDto } from 'src/users/dto/ban-user.dto';
import { GamesService } from '../games/games.service';
import { SetGameDto } from './dto/set-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly gamesService: GamesService,
  ) {}

  async createUser(data: CreateUserDto) {
    const user = this.usersRepository.create(data);

    const role = await this.rolesService.getRoleByName('user');

    user.roles = [role];

    return await this.usersRepository.save(user);
  }

  async updateUser(id: number, data: CreateUserDto) {
    const user = await this.getUserById(id);

    Object.assign(user, data);

    return await this.usersRepository.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.getUserById(id);

    await this.usersRepository.delete(user.id);

    return user;
  }

  async getAllUsers() {
    return await this.usersRepository.find({
      relations: { roles: true, games: true },
    });
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: Equal(id) },
      relations: { roles: true, games: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUserByLogin(login: string) {
    const user = await this.usersRepository.findOne({
      where: { login: Equal(login) },
      relations: { roles: true, games: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async addRole(data: SetRoleDto) {
    const user = await this.getUserById(data.userId);
    const role = await this.rolesService.getRoleById(data.roleId);

    user.roles.push(role);

    await this.usersRepository.save(user);

    return user;
  }

  async removeRole(data: SetRoleDto) {
    const user = await this.getUserById(data.userId);
    const role = await this.rolesService.getRoleById(data.roleId);

    user.roles.splice(user.roles.indexOf(role), 1);

    await this.usersRepository.save(user);

    return user;
  }

  async addGame(data: SetGameDto) {
    const user = await this.getUserById(data.userId);
    const game = await this.gamesService.getGameById(data.gameId);

    user.games.push(game);

    await this.usersRepository.save(user);

    return user;
  }

  async removeGame(data: SetGameDto) {
    const user = await this.getUserById(data.userId);
    const game = await this.gamesService.getGameById(data.gameId);

    user.games.splice(user.games.indexOf(game), 1);

    await this.usersRepository.save(user);

    return user;
  }

  async ban(data: BanUserDto) {
    const user = await this.getUserById(data.userId);

    user.banned = true;
    user.banReason = data.banReason;

    await this.usersRepository.save(user);

    return user;
  }

  async unban(id: number) {
    const user = await this.getUserById(id);

    user.banned = false;
    user.banReason = null;

    await this.usersRepository.save(user);

    return user;
  }

  async getStreamerToken(id: number) {
    const user = await this.getUserById(id);

    return user.streamerToken;
  }
}
