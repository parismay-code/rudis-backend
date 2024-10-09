import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from 'src/roles/roles.service';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { Role } from 'src/roles/role.entity';
import { Roles } from '../auth/role-auth.decorator';
import { RoleGuard } from '../auth/role.guard';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Role })
  @Roles('admin')
  @UseGuards(RoleGuard)
  create(@Body() data: CreateRoleDto) {
    return this.roleService.createRole(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update role by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Role })
  @Roles('admin')
  @UseGuards(RoleGuard)
  update(@Body() data: CreateRoleDto, @Param('id') id: number) {
    return this.roleService.updateRole(id, data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete role by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Role })
  @Roles('admin')
  @UseGuards(RoleGuard)
  delete(@Param('id') id: number) {
    return this.roleService.deleteRole(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: HttpStatus.OK, type: [Role] })
  getAll() {
    return this.roleService.getAllRoles();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: HttpStatus.OK, type: Role })
  getOne(@Param('id') id: number) {
    return this.roleService.getRoleById(id);
  }
}
