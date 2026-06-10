import * as bcrypt from 'bcryptjs';
import { CacheService } from 'mvc-common-toolkit';
import { In, Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CloudinaryService } from '@modules/cloudinary/services/cloudinary.service';

import { CACHE_KEYS } from '@shared/cache-key';
import { ERR_CODE, INJECTION_TOKEN, getStorageFolder } from '@shared/constants';
import { ROLE } from '@shared/enums';
import {
  OperationResult,
  generateConflictResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
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
    private readonly cloudinaryService: CloudinaryService,
    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    private readonly cacheService: CacheService,
  ) {
    super(userRepository);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['profile', 'coin', 'rank'],
    });
  }

  async findUsersByUsernames(usernames: string[]): Promise<User[]> {
    if (!usernames || usernames.length === 0) {
      return [];
    }
    return this.userRepository.find({
      where: {
        username: In(usernames),
      },
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

  async createUser(dto: CreateUserDto): Promise<OperationResult<User>> {
    const { email, password, username, fullName, role } = dto;

    // Check unique email and username
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      return generateConflictResult('Email already exists');
    }
    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      return generateConflictResult('Username already exists');
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Default role is USER if not provided
    const resolvedRole = role || ROLE.USER;

    const savedUser = await this.model.manager.transaction(
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
        const createdUser = await transactionalEntityManager.save(User, user);

        // 3. Create UserProfile
        const profile = transactionalEntityManager.create(UserProfile, {
          userId: createdUser.id,
          fullName,
          streak: 0,
        });
        await transactionalEntityManager.save(UserProfile, profile);

        // 4. Create Rank
        const rank = transactionalEntityManager.create(Rank, {
          amount: 0,
          order: newOrder,
          userId: createdUser.id,
        });
        await transactionalEntityManager.save(Rank, rank);

        // 5. Create Coin
        const coin = transactionalEntityManager.create(Coin, {
          amount: 0,
          userId: createdUser.id,
        });
        await transactionalEntityManager.save(Coin, coin);

        // Return the saved user without password
        const resultUser = await transactionalEntityManager.findOne(User, {
          where: { id: createdUser.id },
          relations: ['profile', 'coin', 'rank'],
        });

        if (resultUser) {
          delete resultUser.password;
        }
        return resultUser!;
      },
    );

    return generateSuccessResult(savedUser);
  }

  async findOrCreateUser(profile: any): Promise<OperationResult<User>> {
    return this.userSocialAccountService.findOrCreateUser(profile);
  }

  async getAllUsers(): Promise<OperationResult<User[]>> {
    const users = await this.userRepository.find({
      relations: ['profile', 'coin', 'rank'],
      order: { createdAt: 'DESC' },
    });
    return generateSuccessResult(users);
  }

  async getUserByID(id: string): Promise<OperationResult<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'coin', 'rank'],
    });
    if (!user) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
    }
    return generateSuccessResult(user);
  }

  async updateUserById(
    id: string,
    dto: UpdateUserProfileDto | AdminUpdateUserDto,
  ): Promise<OperationResult<User>> {
    const userResult = await this.getUserByID(id);
    if (!userResult.success) {
      return userResult;
    }
    const user = userResult.data;

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        return generateConflictResult('Email already exists');
      }
      user.email = dto.email;
    }

    if (dto.username && dto.username !== user.username) {
      const existing = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existing) {
        return generateConflictResult('Username already exists');
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

    const updatedUserResult = await this.getUserByID(id);
    if (!updatedUserResult.success) {
      return updatedUserResult;
    }
    const updatedUser = updatedUserResult.data;
    delete updatedUser.password;
    return generateSuccessResult(updatedUser);
  }

  async deleteUser(id: string): Promise<OperationResult<void>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return generateNotFoundResult('User not found', ERR_CODE.USER_NOT_FOUND);
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

    return generateSuccessResult(undefined);
  }

  async updateUserAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<OperationResult<User>> {
    const userResult = await this.getUserByID(userId);
    if (!userResult.success) {
      return userResult;
    }
    const user = userResult.data;

    // Clean up old avatar from Cloudinary if it is not the default one
    if (user.avatarUrl) {
      const publicId = this.cloudinaryService.extractPublicId(user.avatarUrl);
      if (publicId) {
        await this.cloudinaryService.deleteImage(publicId);
      }
    }

    // Upload new avatar to avatars folder
    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      getStorageFolder().AVATAR,
    );

    user.avatarUrl = uploadResult.secure_url;
    const updatedUser = await this.userRepository.save(user);

    // Invalidate avatar cache
    await this.cacheService.del(CACHE_KEYS.IDENTITY.USER_AVATAR(userId));
    await this.cacheService.del(CACHE_KEYS.IDENTITY.AVATARS_ALL());

    delete updatedUser.password;
    return generateSuccessResult(updatedUser);
  }
}
