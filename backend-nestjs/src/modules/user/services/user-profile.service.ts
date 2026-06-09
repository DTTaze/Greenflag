import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { UserProfile } from '../entities/user-profile.entity';

@Injectable()
export class UserProfileService extends BaseCRUDService<UserProfile> {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {
    super(userProfileRepository);
  }
}
