import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
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
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SetRoleDto } from 'src/users/dto/set-role.dto';
import { User } from 'src/users/user.entity';
import { Roles } from 'src/auth/role-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  create(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  update(@Body() data: CreateUserDto, @Param('id') id: number) {
    return this.usersService.updateUser(id, data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  delete(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @Roles('admin')
  @UseGuards(RoleGuard)
  getAll() {
    return this.usersService.getAllUsers();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  getOne(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/roles')
  @ApiOperation({ summary: 'Add user role' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  addRole(@Body() data: SetRoleDto) {
    return this.usersService.addRole(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/roles')
  @ApiOperation({ summary: 'Remove user role' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  removeRole(@Body() data: SetRoleDto) {
    return this.usersService.removeRole(data);
  }
}
