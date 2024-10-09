import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthorizedRequest } from '../app.types';

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login to account' })
  @ApiResponse({ status: HttpStatus.OK })
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new users' })
  @ApiResponse({ status: HttpStatus.CREATED })
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/user')
  @ApiOperation({ summary: 'Get current session user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard)
  addGame(@Req() request: AuthorizedRequest) {
    return this.authService.refreshUser(request.user);
  }
}
