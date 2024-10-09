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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './game.entity';
import { Roles } from '../auth/role-auth.decorator';
import { RoleGuard } from '../auth/role.guard';

@Controller('games')
@ApiTags('Games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Game })
  @Roles('admin')
  @UseGuards(RoleGuard)
  create(@Body() data: CreateGameDto) {
    return this.gamesService.createGame(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id')
  @ApiOperation({ summary: 'Update game by id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Game })
  @Roles('admin')
  @UseGuards(RoleGuard)
  update(@Body() data: CreateGameDto, @Param('id') id: number) {
    return this.gamesService.updateGame(id, data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({ status: HttpStatus.OK, type: [Game] })
  getAll() {
    return this.gamesService.getAllGames();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  @ApiOperation({ summary: 'Get game by id' })
  @ApiResponse({ status: HttpStatus.OK, type: Game })
  getOne(@Param('id') id: number) {
    return this.gamesService.getGameById(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete game' })
  @ApiResponse({ status: HttpStatus.OK, type: Game })
  @Roles('admin')
  @UseGuards(RoleGuard)
  delete(@Param('id') id: number) {
    return this.gamesService.deleteGame(id);
  }
}
