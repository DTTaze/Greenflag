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

import { Injectable } from '@nestjs/common';

import { PaginationDTO } from '@shared/common/pagination.dto';
import { OperationResult } from '@shared/helpers/operation-result.helper';
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

  public async create(dto: Partial<T>): Promise<OperationResult<T>> {
    try {
      const data = await this.model.save(dto as any);
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('create_failed', error.message);
    }
  }

  public async findOneOrCreate(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
  ): Promise<OperationResult<T>> {
    const foundResult = await this.findOne(filter);
    if (foundResult.success && foundResult.data) {
      return foundResult as OperationResult<T>;
    }
    return this.create(dto);
  }

  public async createWithOpts(
    dto: Partial<T>,
    opts: RunnerUser,
  ): Promise<OperationResult<T>> {
    try {
      const queryBuilder = this.model.createQueryBuilder(
        opts.alias,
        opts.runner,
      );

      const insertResult = await queryBuilder
        .insert()
        .into(this.model.target)
        .values(dto as any)
        .returning('*')
        .execute();

      return OperationResult.success(insertResult.generatedMaps[0] as T);
    } catch (error) {
      return OperationResult.fail('create_failed', error.message);
    }
  }

  public async updateByIdWithOpts(
    id: number | string,
    dto: Partial<T>,
    opts: RunnerUser,
  ): Promise<OperationResult<T>> {
    try {
      const queryBuilder = this.model.createQueryBuilder(
        opts.alias,
        opts.runner,
      );

      const updateResult = await queryBuilder
        .update()
        .set(dto as any)
        .whereInIds(id)
        .returning('*')
        .execute();

      return OperationResult.success(updateResult.generatedMaps[0] as T);
    } catch (error) {
      return OperationResult.fail('update_failed', error.message);
    }
  }

  public async deleteByIdWithOpts(
    id: number | string,
    opts: RunnerUser & { isSoft?: boolean },
  ): Promise<OperationResult<void>> {
    try {
      const queryBuilder = this.model.createQueryBuilder(
        opts.alias,
        opts.runner,
      );

      const deleteSmt = opts.isSoft
        ? queryBuilder.softDelete()
        : queryBuilder.delete();

      await deleteSmt.whereInIds(id).execute();
      return OperationResult.success(undefined);
    } catch (error) {
      return OperationResult.fail('delete_failed', error.message);
    }
  }

  public async findByID(
    id: number | string,
    options: Omit<FindOptions<T>, 'sort'> = { withDeleted: false },
  ): Promise<OperationResult<T>> {
    try {
      const data = await this.model.findOne({
        where: { id: id as any, deletedAt: IsNull() } as any,
        select: options.select,
        relations: options.relations,
        withDeleted: options.withDeleted,
      });
      if (!data) {
        return OperationResult.fail('not_found', 'Resource not found');
      }
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('find_failed', error.message);
    }
  }

  public async findByIdWithOpts(
    id: number | string,
    opts: RunnerUser,
  ): Promise<OperationResult<T>> {
    try {
      const queryBuilder = this.model.createQueryBuilder(
        opts.alias,
        opts.runner,
      );
      const data = await queryBuilder.where({ id }).getOne();
      if (!data) {
        return OperationResult.fail('not_found', 'Resource not found');
      }
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('find_failed', error.message);
    }
  }

  public async count(
    filter: FindOptionsWhere<T>,
    options: { withDeleted?: boolean } = { withDeleted: false },
  ): Promise<OperationResult<number>> {
    try {
      const data = await this.model.count({
        withDeleted: options.withDeleted,
        where: filter,
      });
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('count_failed', error.message);
    }
  }

  public async deleteOne(
    filter: FindOptionsWhere<T>,
  ): Promise<OperationResult<DeleteResult>> {
    try {
      const data = await this.model.softDelete(filter);
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('delete_failed', error.message);
    }
  }

  public async findOne(
    filter: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: FindOptions<T> = { withDeleted: false },
  ): Promise<OperationResult<T>> {
    try {
      const data = await this.model.findOne({
        where: filter,
        withDeleted: options.withDeleted,
        select: options.select,
        relations: options.relations,
      });
      if (!data) {
        return OperationResult.fail('not_found', 'Resource not found');
      }
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('find_failed', error.message);
    }
  }

  public async deleteByID(
    entityID: number | string,
  ): Promise<OperationResult<void>> {
    try {
      await this.model.softDelete({ id: entityID } as any);
      return OperationResult.success(undefined);
    } catch (error) {
      return OperationResult.fail('delete_failed', error.message);
    }
  }

  public async findAll(
    filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: FindOptions<T> = { withDeleted: false },
  ): Promise<OperationResult<T[]>> {
    try {
      const parsedSort = queryHelper.parseSort(options.sort);

      const data = await this.model.find({
        order: parsedSort as any,
        select: options.select,
        relations: options.relations,
        withDeleted: options.withDeleted,
        where: filter,
      });
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('find_failed', error.message);
    }
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
  ): Promise<OperationResult<PaginationResult<T>>> {
    try {
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

      return OperationResult.success({
        rows: data,
        total: totalCount,
        limit,
        offset,
      });
    } catch (error) {
      return OperationResult.fail('paginate_failed', error.message);
    }
  }

  public async paginateByKeyword(
    dto: PaginationDTO,
    keywordColumns: (keyof T)[],
    keyword?: string,
    baseFilter?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    options: FindOptions<T> = { withDeleted: false },
  ): Promise<OperationResult<PaginationResult<T>>> {
    try {
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

      return OperationResult.success({
        rows: data,
        total: totalCount,
        limit,
        offset,
      });
    } catch (error) {
      return OperationResult.fail('paginate_failed', error.message);
    }
  }

  public async bulkUpdateByIDs(
    ids: (number | string)[],
    dto: Partial<T>,
  ): Promise<OperationResult<void>> {
    try {
      if (!ids?.length) {
        return OperationResult.fail(
          'bad_request',
          'ids list must not be empty',
        );
      }

      await this.model.update(
        { id: Any(ids) as any, deletedAt: IsNull() } as any,
        dto as any,
      );
      return OperationResult.success(undefined);
    } catch (error) {
      return OperationResult.fail('update_failed', error.message);
    }
  }

  public async bulkUpdate(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
  ): Promise<OperationResult<void>> {
    try {
      await this.model.update(filter, dto as any);
      return OperationResult.success(undefined);
    } catch (error) {
      return OperationResult.fail('update_failed', error.message);
    }
  }

  public async updateByID(
    id: number | string,
    dto: Partial<T>,
  ): Promise<OperationResult<T>> {
    try {
      if (!id) {
        return OperationResult.fail('bad_request', 'missing id for update');
      }

      await this.model.update(
        { id: id as any, deletedAt: IsNull() } as any,
        dto as any,
      );

      return this.findByID(id);
    } catch (error) {
      return OperationResult.fail('update_failed', error.message);
    }
  }

  public async bulkCreate(dto: Partial<T>[]): Promise<OperationResult<T[]>> {
    try {
      const insertResult = await this.model.insert(dto as any[]);
      const data = await this.model.findBy({
        id: Any(insertResult.identifiers.map((i) => i.id)) as any,
      } as any);
      return OperationResult.success(data);
    } catch (error) {
      return OperationResult.fail('create_failed', error.message);
    }
  }

  public async updateOneWithOpts(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
    opts: RunnerUser,
  ): Promise<OperationResult<T>> {
    try {
      const queryBuilder = this.model.createQueryBuilder(
        opts.alias,
        opts.runner,
      );

      const updateResult = await queryBuilder
        .update()
        .set(dto as any)
        .where(filter)
        .returning('*')
        .execute();

      return OperationResult.success(updateResult.generatedMaps[0] as T);
    } catch (error) {
      return OperationResult.fail('update_failed', error.message);
    }
  }

  public async updateOne(
    filter: FindOptionsWhere<T>,
    dto: Partial<T>,
  ): Promise<OperationResult<T>> {
    try {
      if (!filter) {
        return OperationResult.fail('bad_request', 'missing filter for update');
      }

      await this.model.update(
        { ...filter, deletedAt: IsNull() } as any,
        dto as any,
      );

      return this.findOne(filter);
    } catch (error) {
      return OperationResult.fail('update_failed', error.message);
    }
  }
}
