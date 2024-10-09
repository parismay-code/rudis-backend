import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, ValidateIf } from 'class-validator';

export class CreateRoomDto {
  @IsString({ message: 'Room name must be a string' })
  @ApiProperty({ example: 'hello world', description: 'Room name' })
  readonly name: string;

  @IsString({ message: 'Room description must be a string' })
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({
    example: 'test room description',
    description: 'Room description',
  })
  readonly description!: string;

  @IsString({ message: 'Password must be a string' })
  @Length(4, 20, {
    message: 'Password must be between 4 and 20 characters long',
  })
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 'password', description: 'Room password' })
  readonly password!: string;
}
