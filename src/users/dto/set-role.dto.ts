import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetRoleDto {
  @IsString({ message: 'Name must be a string' })
  @ApiProperty({ example: 1, description: 'Role ID' })
  readonly roleId!: number;

  @IsNumber({}, { message: 'User ID must be a number' })
  @ApiProperty({ example: 1, description: 'User ID' })
  readonly userId!: number;
}
