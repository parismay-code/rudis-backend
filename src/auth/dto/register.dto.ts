import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Login must be a string' })
  @ApiProperty({ example: 'login', description: 'User login' })
  readonly login!: string;

  @IsString({ message: 'Password must be a string' })
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  @ApiProperty({ example: 'password', description: 'User password' })
  readonly password!: string;

  @IsString({ message: 'Password must be a string' })
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long',
  })
  @ApiProperty({
    example: 'password',
    description: 'User password confirmation',
  })
  readonly passwordConfirmation!: string;
}
