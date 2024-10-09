import { IsNumber, IsString, Length, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinRoomDto {
  @IsNumber({}, { message: 'Room ID must be a number' })
  @ApiProperty({ example: '1', description: 'Room ID' })
  readonly roomId!: number;

  @IsString({ message: 'Password must be a string' })
  @Length(4, 20, {
    message: 'Password must be between 4 and 20 characters long',
  })
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 'password', description: 'Room password' })
  readonly password!: string;
}
