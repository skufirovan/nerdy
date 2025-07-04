import UserService from "@core/UserService";
import { InMemoryCache } from "@infrastructure/cache";
import UserDto from "@domain/dtos/UserDto";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";
import { User } from "@prisma/generated";
import { calculateLevel } from "@core/GameLogic";

const TTL = 0 * 60 * 60 * 1000;
const cache = new InMemoryCache<bigint, UserDto>(TTL);

export default class UserController {
  static async register(
    accountId: bigint,
    username: string | null,
    nickname: string
  ): Promise<UserDto> {
    try {
      const user = await UserService.register(accountId, username, nickname);
      const dto = new UserDto(user);

      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async getByAccountId(accountId: bigint): Promise<UserDto | null> {
    const cached = cache.get(accountId);

    if (cached) return cached;

    try {
      const user = await UserService.getByAccountId(accountId);

      if (!user) return null;

      const dto = new UserDto(user);
      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async getByNickname(
    accountId: bigint,
    nickname: string
  ): Promise<UserDto | null> {
    const cached = cache.get(accountId);

    if (cached) return cached;

    try {
      const user = await UserService.getByNickname(accountId, nickname);

      if (!user) return null;

      const dto = new UserDto(user);
      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserInfo(
    accountId: bigint,
    data: Partial<Omit<User, NON_UPDATABLE_USER_FIELDS>>
  ): Promise<UserDto> {
    try {
      const user = await UserService.updateUserInfo(accountId, data);

      const dto = new UserDto(user);
      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async addFame(
    accountId: bigint,
    amount: number
  ): Promise<UserDto | null> {
    try {
      const user = await this.getByAccountId(accountId);

      if (!user) return null;

      const updatedFame = user.fame + amount;
      const updatedSeasonalFame = user.seasonalFame + amount;
      const newLevel = calculateLevel(user.level, updatedFame);

      const updatedUser = await this.updateUserInfo(accountId, {
        level: newLevel,
        fame: updatedFame,
        seasonalFame: updatedSeasonalFame,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
