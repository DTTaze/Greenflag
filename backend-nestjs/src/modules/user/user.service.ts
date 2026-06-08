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
} from './dto/user.dto';
import { Coin } from './entities/coin.entity';
import { Rank } from './entities/rank.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService extends BaseCRUDService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rank)
    private readonly rankRepository: Repository<Rank>,
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
  ) {
    super(userRepository);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { googleId },
    });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, password, username, fullName, role } = dto;

    // Check unique email and username
    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    const existingUsername = await this.findByUsername(username);
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

        // 2. Create Rank
        const rank = transactionalEntityManager.create(Rank, {
          amount: 0,
          order: newOrder,
        });
        const savedRank = await transactionalEntityManager.save(Rank, rank);

        // 3. Create User
        const user = transactionalEntityManager.create(User, {
          email,
          password: hashedPassword,
          username,
          fullName,
          role: resolvedRole,
          rankId: savedRank.id,
        });
        const savedUser = await transactionalEntityManager.save(User, user);

        // 4. Update Rank with user_id
        savedRank.userId = savedUser.id;
        await transactionalEntityManager.save(Rank, savedRank);

        // 5. Create Coin
        const coin = transactionalEntityManager.create(Coin, {
          amount: 0,
          userId: savedUser.id,
        });
        await transactionalEntityManager.save(Coin, coin);

        // Return the saved user without password
        const resultUser = await transactionalEntityManager.findOne(User, {
          where: { id: savedUser.id },
          relations: ['coin', 'rank'],
        });

        if (resultUser) {
          delete resultUser.password;
        }
        return resultUser!;
      },
    );
  }

  async findOrCreateUser(profile: any): Promise<User> {
    const email = profile.emails[0].value;
    const googleId = profile.id;
    const displayName = profile.displayName;

    const existingUser = await this.userRepository.findOne({
      where: { email },
      relations: ['coin', 'rank'],
    });

    if (existingUser) {
      // Update Google ID if not set
      if (!existingUser.googleId) {
        existingUser.googleId = googleId;
        await this.userRepository.save(existingUser);
      }
      return existingUser;
    }

    return this.model.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Calculate max order for Rank
        const maxRank = await transactionalEntityManager.findOne(Rank, {
          where: {},
          order: { order: 'DESC' },
        });
        const newOrder = maxRank ? maxRank.order + 1 : 1;

        // 2. Create Rank
        const rank = transactionalEntityManager.create(Rank, {
          amount: 0,
          order: newOrder,
        });
        const savedRank = await transactionalEntityManager.save(Rank, rank);

        // 3. Create User (Default role = ROLE.USER)
        const user = transactionalEntityManager.create(User, {
          email,
          username: displayName,
          fullName: displayName,
          role: ROLE.USER,
          rankId: savedRank.id,
          googleId,
        });
        const savedUser = await transactionalEntityManager.save(User, user);

        // 4. Update Rank with user_id
        savedRank.userId = savedUser.id;
        await transactionalEntityManager.save(Rank, savedRank);

        // 5. Create Coin
        const coin = transactionalEntityManager.create(Coin, {
          amount: 0,
          userId: savedUser.id,
        });
        await transactionalEntityManager.save(Coin, coin);

        // Return the saved user
        const resultUser = await transactionalEntityManager.findOne(User, {
          where: { id: savedUser.id },
          relations: ['coin', 'rank'],
        });

        if (resultUser) {
          delete resultUser.password;
        }
        return resultUser!;
      },
    );
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['coin'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserByID(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['coin', 'rank'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByPublicID(publicId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { publicId },
      relations: ['coin', 'rank'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserById(
    id: number,
    dto: UpdateUserProfileDto | AdminUpdateUserDto,
  ): Promise<User> {
    const user = await this.getUserByID(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }
    if (dto.username && dto.username !== user.username) {
      const existing = await this.findByUsername(dto.username);
      if (existing) {
        throw new ConflictException('Username already exists');
      }
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);

    const updatedUser = await this.getUserByID(id);
    delete updatedUser.password;
    return updatedUser;
  }

  async updateUserByPublicID(
    publicId: string,
    dto: UpdateUserProfileDto,
  ): Promise<User> {
    const user = await this.getUserByPublicID(publicId);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Email already exists');
      }
    }
    if (dto.username && dto.username !== user.username) {
      const existing = await this.findByUsername(dto.username);
      if (existing) {
        throw new ConflictException('Username already exists');
      }
    }

    Object.assign(user, dto);
    await this.userRepository.save(user);

    const updatedUser = await this.getUserByID(user.id);
    delete updatedUser.password;
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.model.manager.transaction(async (transactionalEntityManager) => {
      if (user.rankId) {
        await transactionalEntityManager.delete(Rank, { id: user.rankId });
      }
      await transactionalEntityManager.delete(Coin, { userId: user.id });
      await transactionalEntityManager.delete(User, { id: user.id });
    });
  }

  async deleteUserByPublicID(publicId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { publicId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.deleteUser(user.id);
  }
}
