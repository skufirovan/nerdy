import { DistributedDemoService } from "@core/index";
import {
  DistributedDemoDto,
  DistributedDemoWithDemoAndLikesDto,
} from "@domain/dtos";
import { InMemoryCache } from "@infrastructure/cache";

const TTL = 0 * 24 * 60 * 60 * 1000;
const cache = new InMemoryCache<
  "distributed_demos",
  DistributedDemoWithDemoAndLikesDto[]
>(TTL);

export class DistributedDemoController {
  static async create(
    accountId: bigint,
    demoId: bigint
  ): Promise<DistributedDemoDto> {
    try {
      const distributedDemo = await DistributedDemoService.create(
        accountId,
        demoId
      );

      const dto = new DistributedDemoDto(distributedDemo);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByNameAndNickname(
    accountId: bigint,
    demoName: string,
    userNickname: string
  ): Promise<DistributedDemoDto | null> {
    try {
      const distributedDemo =
        await DistributedDemoService.findByNameAndNickname(
          accountId,
          demoName,
          userNickname
        );

      if (!distributedDemo) return null;

      const dto = new DistributedDemoDto(distributedDemo);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByDemoId(
    accountId: bigint,
    demoId: bigint
  ): Promise<DistributedDemoDto | null> {
    try {
      const distributedDemo = await DistributedDemoService.findByDemoId(
        accountId,
        demoId
      );

      if (!distributedDemo) return null;

      const dto = new DistributedDemoDto(distributedDemo);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentWeekDemos(
    accountId: bigint
  ): Promise<DistributedDemoWithDemoAndLikesDto[]> {
    try {
      const cacheKey = "distributed_demos";

      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const distributedDemos = await DistributedDemoService.getCurrentWeekDemos(
        accountId
      );

      const dtos = distributedDemos.map(
        (d) => new DistributedDemoWithDemoAndLikesDto(d)
      );

      cache.set(cacheKey, dtos);

      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async toggleLike(
    accountId: bigint,
    distributedDemoId: bigint
  ): Promise<boolean> {
    try {
      return await DistributedDemoService.toggleLike(
        accountId,
        distributedDemoId
      );
    } catch (error) {
      throw error;
    }
  }
}
