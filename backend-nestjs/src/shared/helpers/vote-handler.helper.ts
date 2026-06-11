import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

import { NotFoundException } from '@nestjs/common';

import { FORUM_VOTE_TYPE } from '@shared/enums';

export interface VoteHandlerConfig<
  TTarget extends ObjectLiteral,
  TVote extends ObjectLiteral,
> {
  manager: EntityManager;
  userId: string;
  type: FORUM_VOTE_TYPE;
  targetEntityClass: EntityTarget<TTarget>;
  targetId: string;
  targetName: string; // e.g. 'Post' or 'Comment'
  voteEntityClass: EntityTarget<TVote>;
  voteRelationField: keyof TVote & string; // e.g. 'postId' or 'commentId'
  updateScore?: boolean;
}

export async function handleVote<
  TTarget extends ObjectLiteral,
  TVote extends ObjectLiteral,
>(config: VoteHandlerConfig<TTarget, TVote>): Promise<void> {
  const {
    manager,
    userId,
    type,
    targetEntityClass,
    targetId,
    targetName,
    voteEntityClass,
    voteRelationField,
    updateScore = false,
  } = config;

  const target = await manager.findOne(targetEntityClass, {
    where: { id: targetId } as any,
  });
  if (!target) {
    throw new NotFoundException(`${targetName} not found`);
  }

  const existingVote = await manager.findOne(voteEntityClass, {
    where: { [voteRelationField]: targetId, userId } as any,
  });

  if (existingVote) {
    if (type === FORUM_VOTE_TYPE.NONE || (existingVote as any).type === type) {
      // HỦY VOTE
      await manager.remove(existingVote);
      if ((existingVote as any).type === FORUM_VOTE_TYPE.UP) {
        await manager.decrement(
          targetEntityClass,
          { id: targetId },
          'upvotes',
          1,
        );
        if (updateScore) {
          await manager.decrement(
            targetEntityClass,
            { id: targetId },
            'score',
            1,
          );
        }
      } else {
        await manager.decrement(
          targetEntityClass,
          { id: targetId },
          'downvotes',
          1,
        );
      }
    } else {
      // ĐỔI VOTE
      (existingVote as any).type = type;
      await manager.save(existingVote);
      if (type === FORUM_VOTE_TYPE.UP) {
        await manager.increment(
          targetEntityClass,
          { id: targetId },
          'upvotes',
          1,
        );
        if (updateScore) {
          await manager.increment(
            targetEntityClass,
            { id: targetId },
            'score',
            1,
          );
        }
        await manager.decrement(
          targetEntityClass,
          { id: targetId },
          'downvotes',
          1,
        );
      } else {
        await manager.decrement(
          targetEntityClass,
          { id: targetId },
          'upvotes',
          1,
        );
        if (updateScore) {
          await manager.decrement(
            targetEntityClass,
            { id: targetId },
            'score',
            1,
          );
        }
        await manager.increment(
          targetEntityClass,
          { id: targetId },
          'downvotes',
          1,
        );
      }
    }
  } else {
    // VOTE MỚI
    if (type !== FORUM_VOTE_TYPE.NONE) {
      const newVote = manager.create(voteEntityClass, {
        [voteRelationField]: targetId,
        userId,
        type,
      } as any);
      await manager.save(newVote);
      if (type === FORUM_VOTE_TYPE.UP) {
        await manager.increment(
          targetEntityClass,
          { id: targetId },
          'upvotes',
          1,
        );
        if (updateScore) {
          await manager.increment(
            targetEntityClass,
            { id: targetId },
            'score',
            1,
          );
        }
      } else {
        await manager.increment(
          targetEntityClass,
          { id: targetId },
          'downvotes',
          1,
        );
      }
    }
  }
}
