import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Role name must be a string' })
  @ApiProperty({ example: 'admin', description: 'Role name' })
  readonly name!: string;

  @IsString({ message: 'Role description must be a string' })
  @ApiProperty({ example: 'Administrator', description: 'Role description' })
  readonly description!: string;

  @IsNumber({}, { message: 'Role priority must be a number' })
  @ApiProperty({ example: 99, description: 'Role priority' })
  readonly priority!: number;
}
