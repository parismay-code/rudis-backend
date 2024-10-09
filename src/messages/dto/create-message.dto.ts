import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString({ message: 'Text must be a string' })
  @ApiProperty({ example: 'Hello World!', description: 'Message text' })
  text: string;

  @IsNumber({}, { message: 'Room must be a number' })
  @ApiProperty({ example: '1', description: 'Room ID' })
  readonly roomId!: number;

  @IsNumber({}, { message: 'Reply message ID must be a number' })
  @ApiProperty({ example: '1', description: 'Reply Message ID' })
  readonly replyId!: number;
}
