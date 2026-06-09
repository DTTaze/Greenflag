import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ROLE } from '@shared/enums';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import {
  AdminUpdateUserDto,
  CreateUserDto,
  UpdateUserProfileDto,
} from '../dtos/user.dto';
import { Coin } from '../entities/coin.entity';
import { Rank } from '../entities/rank.entity';
import { UserProfile } from '../entities/user-profile.entity';
import { UserSocialAccount } from '../entities/user-social-account.entity';
import { User } from '../entities/user.entity';
import { UserProfileService } from './user-profile.service';
import { UserSocialAccountService } from './user-social-account.service';

@Injectable()
export class UserService extends BaseCRUDService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userProfileService: UserProfileService,
    private readonly userSocialAccountService: UserSocialAccountService,
  ) {
    super(userRepository);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['profile', 'coin', 'rank'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['profile', 'coin', 'rank'],
    });
  }

  async verifyUniquenessUser(dto: {
    email: string;
    username: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    const existingEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      return {
        success: false,
        message: 'Email already exists',
        error: 'already_exists',
      };
    }
    const existingUsername = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      return {
        success: false,
        message: 'Username already exists',
        error: 'already_exists',
      };
    }
    return { success: true };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, password, username, fullName, role } = dto;

    // Check unique email and username
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Default role is USER if not provided
    const resolvedRole = role || ROLE.USER;

    return this.model.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Calculate max order for Rank
        const maxRank = await transactionalEntityManager.findOne(Rank, {
          where: {},
          order: { order: 'DESC' },
        });
        const newOrder = maxRank ? maxRank.order + 1 : 1;

        // 2. Create User
        const user = transactionalEntityManager.create(User, {
          email,
          password: hashedPassword,
          username,
          role: resolvedRole,
        });
        const savedUser = await transactionalEntityManager.save(User, user);

        // 3. Create UserProfile
        const profile = transactionalEntityManager.create(UserProfile, {
          userId: savedUser.id,
          fullName,
          streak: 0,
        });
        await transactionalEntityManager.save(UserProfile, profile);

        // 4. Create Rank
        const rank = transactionalEntityManager.create(Rank, {
          amount: 0,
          order: newOrder,
          userId: savedUser.id,
        });
        await transactionalEntityManager.save(Rank, rank);

        // 5. Create Coin
        const coin = transactionalEntityManager.create(Coin, {
          amount: 0,
          userId: savedUser.id,
        });
        await transactionalEntityManager.save(Coin, coin);

        // Return the saved user without password
        const resultUser = await transactionalEntityManager.findOne(User, {
          where: { id: savedUser.id },
          relations: ['profile', 'coin', 'rank'],
        });

        if (resultUser) {
          delete resultUser.password;
        }
        return resultUser!;
      },
    );
  }

  async findOrCreateUser(profile: any): Promise<User> {
    return this.userSocialAccountService.findOrCreateUser(profile);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile', 'coin', 'rank'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserByID(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'coin', 'rank'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserById(
    id: string,
    dto: UpdateUserProfileDto | AdminUpdateUserDto,
  ): Promise<User> {
    const user = await this.getUserByID(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Email already exists');
      }
      user.email = dto.email;
    }

    if (dto.username && dto.username !== user.username) {
      const existing = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existing) {
        throw new ConflictException('Username already exists');
      }
      user.username = dto.username;
    }

    if ('role' in dto && dto.role) {
      user.role = dto.role;
    }

    await this.userRepository.save(user);

    // Update profile fields
    if (user.profile) {
      if (dto.fullName) user.profile.fullName = dto.fullName;
      if (dto.phoneNumber) user.profile.phoneNumber = dto.phoneNumber;
      await this.userProfileService.model.save(user.profile);
    }

    const updatedUser = await this.getUserByID(id);
    delete updatedUser.password;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.model.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(Rank, { userId: user.id });
      await transactionalEntityManager.delete(Coin, { userId: user.id });
      await transactionalEntityManager.delete(UserProfile, { userId: user.id });
      await transactionalEntityManager.delete(UserSocialAccount, {
        userId: user.id,
      });
      await transactionalEntityManager.delete(User, { id: user.id });
    });
  }
}
