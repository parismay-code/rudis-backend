import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SetRoleDto } from 'src/users/dto/set-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
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
      relations: { roles: true },
    });
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: Equal(id) },
      relations: { roles: true },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUserByLogin(login: string) {
    const user = await this.usersRepository.findOne({
      where: { login: Equal(login) },
      relations: { roles: true },
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
}
