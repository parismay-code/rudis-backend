import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetGameDto {
  @IsNumber({}, { message: 'Game ID must be a number' })
  @ApiProperty({ example: 1, description: 'Game ID' })
  readonly gameId!: number;

  @IsNumber({}, { message: 'User ID must be a number' })
  @ApiProperty({ example: 1, description: 'User ID' })
  readonly userId!: number;
}
