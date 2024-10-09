import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.validateUser(data);

    return this.generateToken(user);
  }

  async register(data: RegisterDto) {
    if (data.password !== data.passwordConfirmation) {
      throw new HttpException('Password mismatch', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(data.password, 5);

    const user = await this.usersService.createUser({
      login: data.login,
      email: data.email,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  async refreshUser(user: User) {
    user = await this.usersService.getUserById(user.id);

    const { token } = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  private generateToken(user: User) {
    const payload = {
      id: user.id,
      login: user.login,
      email: user.email,
      banned: user.banned,
      banReason: user.banReason,
      roles: user.roles,
      games: user.games,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(data: LoginDto) {
    const user = await this.usersService.getUserByLogin(data.login);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Incorrect credentials',
      });
    }

    const passwordEquals = await bcrypt.compare(data.password, user.password);

    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: 'Incorrect credentials',
      });
    }

    return user;
  }
}
