import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthorizedRequest } from '../app.types';

export function validate(request: AuthorizedRequest, jwtService: JwtService) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedException({ message: 'Not authorized' });
  }

  const tokenType = authHeader.split(' ')[0];
  const tokenValue = authHeader.split(' ')[1];

  if (tokenType !== 'Bearer' || !tokenValue) {
    throw new UnauthorizedException({ message: 'Not authorized' });
  }

  try {
    request.user = jwtService.verify(tokenValue);

    return request.user;
  } catch (err) {
    throw new UnauthorizedException({ message: err.message });
  }
}
