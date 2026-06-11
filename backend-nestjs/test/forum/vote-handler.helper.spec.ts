import { EntityManager } from 'typeorm';

import { FORUM_VOTE_TYPE } from '@shared/enums';

import { handleVote } from '../../src/shared/helpers/vote-handler.helper';

describe('VoteHandlerHelper', () => {
  let mockManager: jest.Mocked<EntityManager>;
  let mockTarget: any;
  let mockExistingVote: any;

  class MockTarget {
    id: string;
    upvotes = 0;
    downvotes = 0;
    score = 0;
  }

  class MockVote {
    id: string;
    userId: string;
    targetId: string;
    type: FORUM_VOTE_TYPE;
    commentId?: string;
  }

  beforeEach(() => {
    mockTarget = new MockTarget();
    mockTarget.id = 'target-123';
    mockTarget.upvotes = 5;
    mockTarget.downvotes = 2;
    mockTarget.score = 3;

    mockExistingVote = null;

    mockManager = {
      findOne: jest.fn().mockImplementation((entityClass, options) => {
        if (entityClass === MockTarget) {
          return Promise.resolve(mockTarget);
        }
        if (entityClass === MockVote) {
          return Promise.resolve(mockExistingVote);
        }
        return Promise.resolve(null);
      }),
      create: jest.fn().mockImplementation((entityClass, plainObject) => {
        const vote = new MockVote();
        Object.assign(vote, plainObject);
        return vote;
      }),
      save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
      remove: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
      increment: jest.fn().mockResolvedValue(undefined),
      decrement: jest.fn().mockResolvedValue(undefined),
    } as any;
  });

  it('should successfully cast a new UP vote when no vote exists', async () => {
    mockExistingVote = null;

    await handleVote({
      manager: mockManager,
      userId: 'user-123',
      type: FORUM_VOTE_TYPE.UP,
      targetEntityClass: MockTarget,
      targetId: 'target-123',
      targetName: 'Comment',
      voteEntityClass: MockVote,
      voteRelationField: 'commentId',
      updateScore: true,
    });

    // Verify fineOne was called for target and vote
    expect(mockManager.findOne).toHaveBeenCalledWith(
      MockTarget,
      expect.anything(),
    );
    expect(mockManager.findOne).toHaveBeenCalledWith(
      MockVote,
      expect.anything(),
    );

    // Verify new vote was created & saved
    expect(mockManager.create).toHaveBeenCalledWith(MockVote, {
      userId: 'user-123',
      commentId: 'target-123', // because Target name is not Post, it uses commentId as fallback
      type: FORUM_VOTE_TYPE.UP,
    });
    expect(mockManager.save).toHaveBeenCalledTimes(1); // saves the new vote
    expect(mockManager.increment).toHaveBeenCalledWith(
      MockTarget,
      { id: 'target-123' },
      'upvotes',
      1,
    );
    expect(mockManager.increment).toHaveBeenCalledWith(
      MockTarget,
      { id: 'target-123' },
      'score',
      1,
    );
  });

  it('should toggle UP vote to DOWN vote correctly', async () => {
    mockExistingVote = new MockVote();
    mockExistingVote.userId = 'user-123';
    mockExistingVote.commentId = 'target-123';
    mockExistingVote.type = FORUM_VOTE_TYPE.UP;

    await handleVote({
      manager: mockManager,
      userId: 'user-123',
      type: FORUM_VOTE_TYPE.DOWN,
      targetEntityClass: MockTarget,
      targetId: 'target-123',
      targetName: 'Comment',
      voteEntityClass: MockVote,
      voteRelationField: 'commentId',
      updateScore: true,
    });

    expect(mockExistingVote.type).toBe(FORUM_VOTE_TYPE.DOWN);
    expect(mockManager.save).toHaveBeenCalledWith(mockExistingVote);
    expect(mockManager.decrement).toHaveBeenCalledWith(
      MockTarget,
      { id: 'target-123' },
      'upvotes',
      1,
    );
    expect(mockManager.decrement).toHaveBeenCalledWith(
      MockTarget,
      { id: 'target-123' },
      'score',
      1,
    );
    expect(mockManager.increment).toHaveBeenCalledWith(
      MockTarget,
      { id: 'target-123' },
      'downvotes',
      1,
    );
  });

  it('should successfully cancel a vote when FORUM_VOTE_TYPE.NONE is specified', async () => {
    mockExistingVote = new MockVote();
    mockExistingVote.userId = 'user-123';
    mockExistingVote.commentId = 'target-123';
    mockExistingVote.type = FORUM_VOTE_TYPE.UP;

    await handleVote({
      manager: mockManager,
      userId: 'user-123',
      type: FORUM_VOTE_TYPE.NONE,
      targetEntityClass: MockTarget,
      targetId: 'target-123',
      targetName: 'Comment',
      voteEntityClass: MockVote,
      voteRelationField: 'commentId',
      updateScore: true,
    });

    expect(mockManager.remove).toHaveBeenCalledWith(mockExistingVote);
    expect(mockManager.decrement).toHaveBeenCalledWith(
      MockTarget,
      { id: 'target-123' },
      'upvotes',
      1,
    );
    expect(mockManager.decrement).toHaveBeenCalledWith(
      MockTarget,
      { id: 'target-123' },
      'score',
      1,
    );
  });
});
