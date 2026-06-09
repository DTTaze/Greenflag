import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { Type } from '../entities/type.entity';

@Injectable()
export class TypeService extends BaseCRUDService<Type> {
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {
    super(typeRepository);
  }
}
