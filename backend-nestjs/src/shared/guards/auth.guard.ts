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

    // Check cookies (state-less JWT in HTTP-only cookies) or Bearer header
    let token = request.cookies?.access_token;

    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      // Initialize context if not present (tracing might initialize it)
      request.context = request.context || { trace: '', span: '' };

      request.context.user = {
        id: payload.id,
        username: payload.username,
        role: payload.role,
        companyId: payload.companyId || '',
        status: payload.status,
        email: payload.email,
        phone: payload.phone,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException(
        'Authentication token is invalid or expired',
      );
    }
  }
}
