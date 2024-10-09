import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { CreateGameRoleDto } from './create-game-role.dto';

export class CreateGameDto {
  @IsString({ message: 'Game name must be a string' })
  @ApiProperty({ example: 'Mafia', description: 'Game name' })
  readonly name!: string;

  @IsString({ message: 'Game description must be a string' })
  @ApiProperty({ example: 'A Mafia game', description: 'Game description' })
  readonly description!: string;

  @IsNumber({}, { message: 'Game min players must be a number' })
  @ApiProperty({
    example: '4',
    description: 'Game minimal players count',
  })
  readonly minPlayers!: number;

  @IsNumber({}, { message: 'Game max players must be a number' })
  @ApiProperty({
    example: '20',
    description: 'Game maximum players count',
  })
  readonly maxPlayers!: number;

  @IsArray({ message: 'Game roles must be an array' })
  @ApiProperty({
    example: [
      {
        name: 'mafia',
        description: 'mafia player role',
        maxPlayers: 4,
        gameId: 1,
      },
    ],
    description: 'Game roles',
  })
  readonly roles!: CreateGameRoleDto[];
}
