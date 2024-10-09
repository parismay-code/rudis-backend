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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SetRoleDto } from 'src/users/dto/set-role.dto';
import { User } from 'src/users/user.entity';
import { Roles } from 'src/auth/role-auth.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { BanUserDto } from 'src/users/dto/ban-user.dto';
import { SetGameDto } from './dto/set-game.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthorizedRequest } from '../app.types';

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

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/games')
  @ApiOperation({ summary: 'Add user game' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard)
  addGame(@Body() data: SetGameDto) {
    return this.usersService.addGame(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/games')
  @ApiOperation({ summary: 'Remove user game' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard)
  removeGame(@Body() data: SetGameDto) {
    return this.usersService.removeGame(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/ban')
  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  ban(@Body() data: BanUserDto) {
    return this.usersService.ban(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/unban/:id')
  @ApiOperation({ summary: 'Unban a user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @Roles('admin')
  @UseGuards(RoleGuard)
  unban(@Param('id') id: number) {
    return this.usersService.unban(id);
  }

  @Get('/streamer-token')
  @ApiOperation({ summary: 'Get a streamer token' })
  @ApiResponse({ status: HttpStatus.OK })
  @Roles('streamer')
  @UseGuards(RoleGuard)
  getStreamerToken(@Req() request: AuthorizedRequest) {
    return this.usersService.getStreamerToken(request.user.id);
  }
}
