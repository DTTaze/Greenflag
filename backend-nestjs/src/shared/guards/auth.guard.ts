import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppRequest } from '../interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AppRequest>();

    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      // Initialize context if not present (tracing might initialize it)
      request.context = request.context || { trace: '', span: '' };

      const userPayload = {
        id: payload.id,
        username: payload.username,
        role: payload.role,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        streak: payload.streak,
        lastCompletedTask: payload.lastCompletedTask,
        avatarUrl: payload.avatarUrl,
      };

      request.user = userPayload;

      request.context.user = {
        id: payload.id.toString(),
        username: payload.username,
        role: payload.role,
        companyId: payload.companyId || '',
        status: payload.status,
        email: payload.email,
        phone: payload.phoneNumber,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException(
        'Authentication token is invalid or expired',
      );
    }
  }
}
