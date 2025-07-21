import { UserService } from "@core/index";
import { InMemoryCache } from "@infrastructure/cache";
import { UserDto } from "@domain/dtos";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";
import { User } from "@prisma/generated";

const TTL = 0 * 60 * 60 * 1000;
const cache = new InMemoryCache<bigint, UserDto>(TTL);

export class UserController {
  static async register(
    accountId: bigint,
    username: string | null,
    nickname: string,
    invitedById: bigint | null
  ): Promise<UserDto> {
    try {
      const user = await UserService.register(
        accountId,
        username,
        nickname,
        invitedById
      );
      const dto = new UserDto(user);

      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByAccountId(accountId: bigint): Promise<UserDto | null> {
    const cached = cache.get(accountId);

    if (cached) return cached;

    try {
      const user = await UserService.findByAccountId(accountId);

      if (!user) return null;

      const dto = new UserDto(user);
      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByNickname(
    accountId: bigint,
    nickname: string
  ): Promise<UserDto | null> {
    try {
      const user = await UserService.findByNickname(accountId, nickname);

      if (!user) return null;

      const dto = new UserDto(user);
      cache.set(user.accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findTopUsersByField(
    accountId: bigint,
    field: keyof Pick<User, "fame" | "seasonalFame">,
    limit: number = 10
  ): Promise<UserDto[]> {
    try {
      const users = await UserService.findTopUsersByField(
        accountId,
        field,
        limit
      );
      return users.map((user) => new UserDto(user));
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

  static async addFame(accountId: bigint, amount: number): Promise<UserDto> {
    try {
      const user = await UserService.addFame(accountId, amount);

      const dto = new UserDto(user);
      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async buyEquipment(
    accountId: bigint,
    brand: string,
    model: string
  ): Promise<UserDto> {
    try {
      const user = await UserService.buyEquipment(accountId, brand, model);

      const dto = new UserDto(user);
      cache.set(accountId, dto);

      return dto;
    } catch (error) {
      throw error;
    }
  }
}
