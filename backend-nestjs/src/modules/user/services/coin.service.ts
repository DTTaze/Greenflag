import {
  CacheService,
  OperationResult,
  SET_CACHE_POLICY,
} from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CACHE_KEYS } from '@shared/cache-key';
import { CACHE_TTL, INJECTION_TOKEN } from '@shared/constants';
import {
  generateBadRequestResult,
  generateNotFoundResult,
  generateSuccessResult,
} from '@shared/helpers/operation-result.helper';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { UpdateCoinDto } from '../dtos/coin.dto';
import { Coin } from '../entities/coin.entity';

@Injectable()
export class CoinService extends BaseCRUDService<Coin> {
  constructor(
    @InjectRepository(Coin)
    private readonly coinRepository: Repository<Coin>,
    @Inject(INJECTION_TOKEN.REDIS_SERVICE)
    private readonly cacheService: CacheService,
  ) {
    super(coinRepository);
  }

  async getCoin(id: string): Promise<OperationResult<Coin>> {
    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    const cached = await this.cacheService.get(key);
    if (cached) {
      return generateSuccessResult(JSON.parse(cached));
    }

    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      return generateNotFoundResult('Coin not found');
    }

    await this.cacheService.set(key, JSON.stringify(coin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return generateSuccessResult(coin);
  }

  async updateCoin(
    id: string,
    dto: UpdateCoinDto,
  ): Promise<OperationResult<Coin>> {
    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      return generateNotFoundResult('Coin not found');
    }

    coin.amount = dto.coins;
    const updatedCoin = await this.coinRepository.save(coin);

    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    await this.cacheService.set(key, JSON.stringify(updatedCoin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return generateSuccessResult(updatedCoin);
  }

  async updateIncreaseCoin(
    id: string,
    dto: UpdateCoinDto,
  ): Promise<OperationResult<Coin>> {
    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      return generateNotFoundResult('Coin not found');
    }

    coin.amount += dto.coins;
    const updatedCoin = await this.coinRepository.save(coin);

    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    await this.cacheService.set(key, JSON.stringify(updatedCoin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return generateSuccessResult(updatedCoin);
  }

  async updateDecreaseCoin(
    id: string,
    dto: UpdateCoinDto,
  ): Promise<OperationResult<Coin>> {
    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      return generateNotFoundResult('Coin not found');
    }

    const newAmount = coin.amount - dto.coins;
    if (newAmount < 0) {
      return generateBadRequestResult(
        'Coin amount cannot be decreased below 0',
      );
    }

    coin.amount = newAmount;
    const updatedCoin = await this.coinRepository.save(coin);

    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    await this.cacheService.set(key, JSON.stringify(updatedCoin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return generateSuccessResult(updatedCoin);
  }
}
