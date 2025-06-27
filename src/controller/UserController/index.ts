import UserService from "@core/UserService";
import { InMemoryCache } from "@infrastructure/cache";
import UserDto from "@domain/dtos/UserDto";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";
import { User } from "@prisma/generated";

const TTL = 0 * 60 * 60 * 1000;
const cache = new InMemoryCache<bigint, UserDto>(TTL);

export default class UserController {
  static async register(accountId: bigint, username: string | null, nickname: string) {
    try {
      const user = await UserService.register(accountId, username, nickname);
      const dto = new UserDto(user);

      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async getByAccountId(accountId: bigint) {
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

  static async getByNickname(nickname: string) {
    try {
      const user = await UserService.getByNickname(nickname);

      if (!user) return null;

      const dto = new UserDto(user);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async updateUserInfo(
    accountId: bigint,
    data: Partial<Omit<User, NON_UPDATABLE_USER_FIELDS>>
  ) {
    try {
      const user = await UserService.updateUserInfo(accountId, data);

      if (!user) return null;

      const dto = new UserDto(user);
      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }
}
