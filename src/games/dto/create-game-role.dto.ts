import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateGameRoleDto {
  @IsString({ message: 'Role name must be a string' })
  @ApiProperty({ example: 'Mafia', description: 'Game role name' })
  readonly name!: string;

  @IsString({ message: 'Game description must be a string' })
  @ApiProperty({
    example: 'A Mafia game',
    description: 'Game role description',
  })
  readonly description!: string;

  @IsNumber({}, { message: 'Game min players must be a number' })
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({
    example: '20',
    description: 'Game minimal players count',
  })
  readonly maxPlayers!: number;

  @IsNumber({}, { message: 'Game max players must be a number' })
  @ApiProperty({
    example: '1',
    description: 'Game ID',
  })
  readonly gameId!: number;
}
