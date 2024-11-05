import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRokes',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const result = request?.currentUser?.roles
      .map((role: string) => allowedRoles?.includes(role))
      .find((val: boolean) => val === true);
    if (result) return true;

    throw new UnauthorizedException('sorry, you are not authorized.');
  }
}
