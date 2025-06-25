import UserService from "@core/UserService";
import { InMemoryCache } from "@infrastructure/cache";
import UserDto from "@domain/dtos/UserDto";

const TTL = 5 * 60 * 60 * 1000;
const cache = new InMemoryCache<bigint, UserDto>(TTL);

export default class UserController {
  static async register(accountId: bigint, username: string | null) {
    try {
      const user = await UserService.register(accountId, username);
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
}
