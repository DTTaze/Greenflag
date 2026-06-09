import { CacheService, SET_CACHE_POLICY } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CACHE_KEYS } from '@shared/cache-key';
import { CACHE_TTL, INJECTION_TOKEN } from '@shared/constants';
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

  async getRankById(rankId: string): Promise<Rank> {
    const key = CACHE_KEYS.IDENTITY.RANK_BY_ID(rankId);
    const cached = await this.cacheService.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const rank = await this.rankRepository.findOne({ where: { id: rankId } });
    if (!rank) {
      throw new NotFoundException('Rank not found');
    }

    await this.cacheService.set(key, JSON.stringify(rank), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return rank;
  }

  async rearrangeRanks(): Promise<Rank[]> {
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

      return result;
    } catch (error) {
      console.error('Error rearranging ranks:', error);
      throw error;
    }
  }
}
