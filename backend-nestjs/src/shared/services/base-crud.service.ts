import { PaginationResult } from 'mvc-common-toolkit';
import {
  Any,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  IsNull,
  ObjectLiteral,
  Repository,
} from 'typeorm';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PaginationDTO } from '@shared/common/pagination.dto';
import * as queryHelper from '@shared/helpers/query.helper';
import { RunnerUser } from '@shared/interfaces';

type FindOptions<T> = {
  select?: FindOptionsSelect<T>;
  relations?: FindOptionsRelations<T>;
  sort?: string;
  withDeleted?: boolean;
};

@Injectable()
export abstract class BaseCRUDService<T extends ObjectLiteral> {
  constructor(public model: Repository<T>) {}

  public async create(dto: Partial<T>): Promise<T> {
    return this.model.save(dto as any);
  }

  public async findOneOrCreate(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
  ): Promise<T> {
    const found = await this.findOne(filter);
    if (found) return found;

    return this.create(dto);
  }

  public async createWithOpts(dto: Partial<T>, opts: RunnerUser): Promise<T> {
    const queryBuilder = this.model.createQueryBuilder(opts.alias, opts.runner);

    const insertResult = await queryBuilder
      .insert()
      .into(this.model.target)
      .values(dto as any)
      .returning('*')
      .execute();

    return insertResult.generatedMaps[0] as T;
  }

  public async updateByIdWithOpts(
    id: number | string,
    dto: Partial<T>,
    opts: RunnerUser,
  ): Promise<T> {
    const queryBuilder = this.model.createQueryBuilder(opts.alias, opts.runner);

    const updateResult = await queryBuilder
      .update()
      .set(dto as any)
      .whereInIds(id)
      .returning('*')
      .execute();

    return updateResult.generatedMaps[0] as T;
  }

  public async deleteByIdWithOpts(
    id: number | string,
    opts: RunnerUser & { isSoft?: boolean },
  ): Promise<void> {
    const queryBuilder = this.model.createQueryBuilder(opts.alias, opts.runner);

    const deleteSmt = opts.isSoft
      ? queryBuilder.softDelete()
      : queryBuilder.delete();

    await deleteSmt.whereInIds(id).execute();
  }

  public findByID(
    id: number | string,
    options: Omit<FindOptions<T>, 'sort'> = { withDeleted: false },
  ): Promise<T | null> {
    return this.model.findOne({
      where: { id: id as any, deletedAt: IsNull() } as any,
      select: options.select,
      relations: options.relations,
      withDeleted: options.withDeleted,
    });
  }

  public findByIdWithOpts(
    id: number | string,
    opts: RunnerUser,
  ): Promise<T | null> {
    const queryBuilder = this.model.createQueryBuilder(opts.alias, opts.runner);

    return queryBuilder.where({ id }).getOne();
  }

  public count(
    filter: FindOptionsWhere<T>,
    options: { withDeleted?: boolean } = { withDeleted: false },
  ): Promise<number> {
    return this.model.count({
      withDeleted: options.withDeleted,
      where: filter,
    });
  }

  public deleteOne(filter: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.model.softDelete(filter);
  }

  public findOne(
    filter: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: FindOptions<T> = { withDeleted: false },
  ): Promise<T | null> {
    return this.model.findOne({
      where: filter,
      withDeleted: options.withDeleted,
      select: options.select,
      relations: options.relations,
    });
  }

  public async deleteByID(entityID: number | string): Promise<void> {
    await this.model.softDelete({ id: entityID } as any);
  }

  public async findAll(
    filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: FindOptions<T> = { withDeleted: false },
  ): Promise<T[]> {
    const parsedSort = queryHelper.parseSort(options.sort);

    return this.model.find({
      order: parsedSort as any,
      select: options.select,
      relations: options.relations,
      withDeleted: options.withDeleted,
      where: filter,
    });
  }

  protected parseLimit(limit: number) {
    return limit || 10;
  }

  protected parseOffset(offset: number) {
    return offset || 0;
  }

  public async paginate(
    dto: PaginationDTO,
    filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: FindOptions<T> = { withDeleted: false },
  ): Promise<PaginationResult<T>> {
    const limit = this.parseLimit(dto.limit);
    const offset = this.parseOffset(dto.offset);

    const [data, totalCount] = await this.model.findAndCount({
      take: limit,
      skip: offset,
      order: queryHelper.parseSort(dto.sort || '-createdAt') as any,
      select: options.select,
      relations: options.relations,
      withDeleted: options.withDeleted,
      where: filter,
    });

    return { rows: data, total: totalCount, limit, offset };
  }

  /**
   * Paginate with case-insensitive keyword search across specified columns.
   */
  public async paginateByKeyword(
    dto: PaginationDTO,
    keywordColumns: (keyof T)[],
    keyword?: string,
    baseFilter?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: FindOptions<T> = { withDeleted: false },
  ): Promise<PaginationResult<T>> {
    const limit = this.parseLimit(dto.limit);
    const offset = this.parseOffset(dto.offset);
    const order = queryHelper.parseSort(dto.sort || '-createdAt') as any;

    const buildWhere = (): FindOptionsWhere<T>[] | FindOptionsWhere<T> => {
      if (!keyword || !keywordColumns.length) {
        return baseFilter ?? {};
      }

      if (Array.isArray(baseFilter)) {
        return baseFilter.flatMap((filter) =>
          keywordColumns.map((col) => ({
            ...filter,
            [col]: ILike(`%${keyword}%`),
          })),
        ) as FindOptionsWhere<T>[];
      }

      return keywordColumns.map((col) => ({
        ...baseFilter,
        [col]: ILike(`%${keyword}%`),
      })) as FindOptionsWhere<T>[];
    };

    const [data, totalCount] = await this.model.findAndCount({
      take: limit,
      skip: offset,
      order,
      select: options.select,
      relations: options.relations,
      withDeleted: options.withDeleted,
      where: buildWhere(),
    });

    return { rows: data, total: totalCount, limit, offset };
  }

  public async bulkUpdateByIDs(
    ids: (number | string)[],
    dto: Partial<T>,
  ): Promise<void> {
    if (!ids?.length) {
      throw new InternalServerErrorException('ids list must not be empty');
    }

    await this.model.update(
      { id: Any(ids) as any, deletedAt: IsNull() } as any,
      dto as any,
    );
  }

  public async bulkUpdate(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
  ): Promise<void> {
    await this.model.update(filter, dto as any);
  }

  public async updateByID(
    id: number | string,
    dto: Partial<T>,
  ): Promise<T | null> {
    if (!id) {
      throw new InternalServerErrorException('missing id for update');
    }

    await this.model.update(
      { id: id as any, deletedAt: IsNull() } as any,
      dto as any,
    );

    return this.findByID(id);
  }

  public async bulkCreate(dto: Partial<T>[]): Promise<T[]> {
    const insertResult = await this.model.insert(dto as any[]);
    return this.model.findBy({
      id: Any(insertResult.identifiers.map((i) => i.id)) as any,
    } as any);
  }

  public async updateOneWithOpts(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
    opts: RunnerUser,
  ): Promise<T | null> {
    const queryBuilder = this.model.createQueryBuilder(opts.alias, opts.runner);

    const updateResult = await queryBuilder
      .update()
      .set(dto as any)
      .where(filter)
      .returning('*')
      .execute();

    return updateResult.generatedMaps[0] as T;
  }

  public async updateOne(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
  ): Promise<T | null> {
    if (!filter) {
      throw new InternalServerErrorException('missing filter for update');
    }

    await this.model.update(
      { ...filter, deletedAt: IsNull() } as any,
      dto as any,
    );

    return this.findOne(filter);
  }
}
