import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @IsNumber({}, { message: 'User ID must be a number' })
  @ApiProperty({ example: '1', description: 'User ID' })
  readonly userId!: number;

  @IsString({ message: 'Ban reason must be a string' })
  @ApiProperty({ example: 'Ban reason', description: 'User ban reason' })
  readonly banReason!: string;
}
