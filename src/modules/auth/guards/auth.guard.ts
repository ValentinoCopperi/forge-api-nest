import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token_header = request.headers['authorization'];

    if (!token_header) throw new UnauthorizedException();

    const [type, token] = token_header.split(' ');

    const validateToken = this.validateToken(token);

    if (!validateToken) throw new UnauthorizedException();

    return true;
  }

  private validateToken(token: string): boolean {
    return token === 'secret-token';
  }
}
