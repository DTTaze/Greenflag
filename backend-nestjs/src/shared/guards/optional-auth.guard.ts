import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@modules/user/services/user.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  private readonly logger = new Logger(OptionalAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.user = null;
    request.activeUser = null;

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findByID(payload.id);

      if (user) {
        request.user = { id: payload.id };
        request.activeUser = user;
      }
    } catch (err) {
      this.logger.warn(`Invalid JWT token: ${err.message}`);
    }
    return true;
  }
}
