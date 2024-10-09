import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './room.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthorizedRequest } from '../app.types';

@Controller('rooms')
@ApiTags('Rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Room })
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateRoomDto) {
    return this.roomsService.createRoom(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update room by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Room })
  @UseGuards(JwtAuthGuard)
  update(
    @Req() request: AuthorizedRequest,
    @Body() data: CreateRoomDto,
    @Param('id') id: number,
  ) {
    return this.roomsService.updateRoom(id, data, request.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete room by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Room })
  @UseGuards(JwtAuthGuard)
  delete(@Req() request: AuthorizedRequest, @Param('id') id: number) {
    return this.roomsService.deleteRoom(id, request.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: HttpStatus.OK, type: [Room] })
  getAll() {
    return this.roomsService.getAllRooms();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: HttpStatus.OK, type: Room })
  getOne(@Param('id') id: number) {
    return this.roomsService.getRoomById(id);
  }
}
