import { CacheService, SET_CACHE_POLICY } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CACHE_KEYS } from '@shared/cache-key';
import { CACHE_TTL, INJECTION_TOKEN } from '@shared/constants';
import { BaseCRUDService } from '@shared/services/base-crud.service';

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

  async getCoin(id: string): Promise<Coin> {
    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    const cached = await this.cacheService.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      throw new NotFoundException('Coin not found');
    }

    await this.cacheService.set(key, JSON.stringify(coin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return coin;
  }

  async updateCoin(id: string, coins: number): Promise<Coin> {
    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      throw new NotFoundException('Coin not found');
    }

    coin.amount = coins;
    const updatedCoin = await this.coinRepository.save(coin);

    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    await this.cacheService.set(key, JSON.stringify(updatedCoin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return updatedCoin;
  }

  async updateIncreaseCoin(id: string, coins: number): Promise<Coin> {
    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      throw new NotFoundException('Coin not found');
    }

    coin.amount += coins;
    const updatedCoin = await this.coinRepository.save(coin);

    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    await this.cacheService.set(key, JSON.stringify(updatedCoin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return updatedCoin;
  }

  async updateDecreaseCoin(id: string, coins: number): Promise<Coin> {
    const coin = await this.coinRepository.findOne({ where: { id } });
    if (!coin) {
      throw new NotFoundException('Coin not found');
    }

    const newAmount = coin.amount - coins;
    if (newAmount < 0) {
      throw new BadRequestException('Coin amount cannot be decreased below 0');
    }

    coin.amount = newAmount;
    const updatedCoin = await this.coinRepository.save(coin);

    const key = CACHE_KEYS.COMMERCE.COIN_BY_ID(id);
    await this.cacheService.set(key, JSON.stringify(updatedCoin), {
      policy: SET_CACHE_POLICY.WITH_TTL,
      value: CACHE_TTL.ONE_HOUR,
    });
    return updatedCoin;
  }
}
