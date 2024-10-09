import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from 'src/roles/role.entity';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { DEFAULT_ROLES } from './roles.constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {
    for (const roleData of DEFAULT_ROLES) {
      this.rolesRepository
        .exists({ where: { name: Equal(roleData.name) } })
        .then(async (exists) => {
          if (!exists) {
            const role = this.rolesRepository.create(roleData);

            await this.rolesRepository.save(role);
          }
        });
    }
  }

  async getRolesWhereName(names: string[]) {
    return this.rolesRepository.find({
      where: names.map((name) => ({
        name,
      })),
    });
  }

  async createRole(data: CreateRoleDto) {
    const role = this.rolesRepository.create(data);

    return await this.rolesRepository.save(role);
  }

  async updateRole(id: number, data: CreateRoleDto) {
    const role = await this.getRoleById(id);

    Object.assign(role, data);

    return await this.rolesRepository.save(role);
  }

  async deleteRole(id: number) {
    const role = await this.getRoleById(id);

    await this.rolesRepository.delete(role.id);

    return role;
  }

  async getAllRoles() {
    return await this.rolesRepository.find();
  }

  async getRoleByName(name: string) {
    const role = await this.rolesRepository.findOne({
      where: { name: Equal(name) },
    });

    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async getRoleById(id: number) {
    const role = await this.rolesRepository.findOne({
      where: { id: Equal(id) },
    });

    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    return role;
  }
}
