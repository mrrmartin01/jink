import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from './follow.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('FollowService', () => {
  let service: FollowService;

  const mockPrisma = {
    follow: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('followUser', () => {
    it('should throw if user tries to follow themselves', async () => {
      await expect(service.followUser(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should follow another user', async () => {
      const mockResult = { followerId: 1, followingId: 2 };
      mockPrisma.follow.create.mockResolvedValue(mockResult);

      const result = await service.followUser(1, 2);

      expect(mockPrisma.follow.create).toHaveBeenCalledWith({
        data: {
          followerId: 1,
          followingId: 2,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user', async () => {
      const mockResult = { followerId: 1, followingId: 2 };
      mockPrisma.follow.delete.mockResolvedValue(mockResult);

      const result = await service.unfollowUser(1, 2);

      expect(mockPrisma.follow.delete).toHaveBeenCalledWith({
        where: {
          followerId_followingId: {
            followerId: 1,
            followingId: 2,
          },
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getFollowers', () => {
    it("should return a user's followers", async () => {
      const mockResult = [
        { follower: { id: 1, userName: 'astro' } },
        { follower: { id: 2, userName: 'dev' } },
      ];
      mockPrisma.follow.findMany.mockResolvedValue(mockResult);

      const result = await service.getFollowers(3);

      expect(mockPrisma.follow.findMany).toHaveBeenCalledWith({
        where: { followingId: 3 },
        include: { follower: true },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getFollowing', () => {
    it('should return users the user is following', async () => {
      const mockResult = [
        { following: { id: 5, userName: 'verse' } },
        { following: { id: 6, userName: 'nova' } },
      ];
      mockPrisma.follow.findMany.mockResolvedValue(mockResult);

      const result = await service.getFollowing(1);

      expect(mockPrisma.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: 1 },
        include: { following: true },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
