import { CacheService, SET_CACHE_POLICY } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CACHE_KEYS } from '@shared/cache-key';
import { CACHE_TTL, ERR_CODE, INJECTION_TOKEN } from '@shared/constants';
import {
  OperationResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { Rank } from '../entities/rank.entity';

@Injectable()
export class RankService extends BaseCRUDService<Rank> {
  constructor(
    @InjectRepository(Rank)
    private readonly rankRepository: Repository<Rank>,
    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    private readonly cacheService: CacheService,
  ) {
    super(rankRepository);
  }

  async getRankById(rankId: string): Promise<OperationResult<Rank>> {
    const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rankId);
    const cached = await this.cacheService.get(key);
    if (cached) {
      return generateSuccessResult(JSON.parse(cached));
    }

    const rank = await this.rankRepository.findOne({ where: { id: rankId } });
    if (!rank) {
      return generateNotFoundResult('Rank not found', ERR_CODE.RANK_NOT_FOUND);
    }

    await this.cacheService.set(key, JSON.stringify(rank), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return generateSuccessResult(rank);
  }

  async rearrangeRanks(): Promise<OperationResult<Rank[]>> {
    try {
      const ranks = await this.rankRepository.find({
        order: { amount: 'DESC' },
      });

      const result: Rank[] = [];
      for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i];
        rank.order = i + 1;
        const updatedRank = await this.rankRepository.save(rank);

        const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rank.id);
        await this.cacheService.set(key, JSON.stringify(updatedRank), {
          policy: SET_CACHE_POLICY.WITH_TTL,
          value: CACHE_TTL.ONE_HOUR,
        });
        result.push(updatedRank);
      }

      return generateSuccessResult(result);
    } catch (error) {
      console.error('Error rearranging ranks:', error);
      throw error;
    }
  }
}
