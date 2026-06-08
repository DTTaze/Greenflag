import * as bcrypt from 'bcryptjs';
import { CacheService, SET_CACHE_POLICY } from 'mvc-common-toolkit';

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { INJECTION_TOKEN } from '@shared/constants';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    private readonly cacheService: CacheService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const payload = {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      streak: user.streak,
      lastCompletedTask: user.lastCompletedTask,
      avatarUrl: user.avatarUrl,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: payload,
    };
  }

  async googleLogin(user: any): Promise<{ access_token: string; user: any }> {
    const payload = {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      streak: user.streak,
      lastCompletedTask: user.lastCompletedTask,
      avatarUrl: user.avatarUrl,
      googleId: user.googleId,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: payload,
    };
  }

  async sendForgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    // Generate forgot password token
    const token = await this.jwtService.signAsync(
      { email },
      { expiresIn: '1h' },
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/forgot_password?token=${token}`;

    console.log('Reset link: ', resetLink);
    console.log('Sending reset email to:', email);

    // Standard email html formatting
    const htmlContent = `
      <h1>Reset Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you!</p>
    `;

    // Logging for development visibility
    return { message: 'Reset password link printed to console successfully' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ email: string }> {
    let email: string;
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      email = decoded.email;
    } catch (err) {
      throw new BadRequestException('Reset token is invalid or expired');
    }

    if (!email) {
      throw new BadRequestException('Missing email from decoded reset token');
    }

    // Rate limiting check via Redis
    const cacheKey = `reset:email:${email}`;
    const emailCache = await this.cacheService.get(cacheKey);
    if (emailCache) {
      throw new BadRequestException('Email can only be reset once per hour');
    }

    // Hash and update password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.updateUserById(user.id, {
      password: hashedPassword,
    } as any);

    // Set lock for 1 hour (3600 seconds)
    await this.cacheService.set(cacheKey, email, {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: 3600,
    });

    return { email };
  }
}
