import { UserRepository } from "@infrastructure/repositories";
import { UserEquipmentService } from "../UserEquipmentService";
import serviceLogger from "@infrastructure/logger/serviceLogger";
import { User } from "@prisma/generated";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";

export class UserService {
  static async register(
    accountId: bigint,
    username: string | null,
    nickname: string
  ): Promise<User> {
    const meta = {
      accountId,
      username,
    };

    try {
      const existingUser = await this.getByAccountId(accountId);

      if (existingUser) {
        if (existingUser.username !== username) {
          await this.updateUserInfo(accountId, { username });
          return { ...existingUser, username };
        }
        return existingUser;
      }

      const newUser = await UserRepository.create(
        accountId,
        username,
        nickname
      );
      await UserEquipmentService.create(accountId, BigInt(1), true);
      await UserEquipmentService.create(accountId, BigInt(2), true);
      await UserEquipmentService.create(accountId, BigInt(3), true);

      serviceLogger(
        "info",
        "UserService.register",
        "Новый пользователь зарегистрирован",
        meta
      );

      return newUser;
    } catch (error) {
      serviceLogger(
        "error",
        "UserService.register",
        `Ошибка регистрации: ${(error as Error).message}`,
        meta
      );
      throw new Error("Ошибка при регистрации пользователя");
    }
  }

  static async getByAccountId(accountId: bigint): Promise<User | null> {
    const meta = { accountId };

    try {
      const user = await UserRepository.findByAccountId(accountId);

      if (user) {
        return user;
      }

      serviceLogger(
        "warn",
        "UserService.getByAccountId",
        "Пользователь не найден",
        meta
      );

      return null;
    } catch (error) {
      serviceLogger(
        "error",
        "UserService.getByAccountId",
        `Ошибка получения пользователя: ${(error as Error).message}`,
        meta
      );
      throw new Error("Ошибка при получении пользователя");
    }
  }

  static async getByNickname(
    accountId: bigint,
    nickname: string
  ): Promise<User | null> {
    const meta = { accountId };

    try {
      const user = await UserRepository.findByNickname(nickname);

      if (user) {
        return user;
      }

      serviceLogger(
        "warn",
        "UserService.getByNickname",
        "Пользователь не найден",
        meta
      );

      return null;
    } catch (error) {
      serviceLogger(
        "error",
        "UserService.getByNickname",
        `Ошибка получения пользователя по нику ${nickname}: ${
          (error as Error).message
        }`
      );
      throw new Error("Ошибка при получении пользователя по нику");
    }
  }

  static async updateUserInfo(
    accountId: bigint,
    data: Partial<Omit<User, NON_UPDATABLE_USER_FIELDS>>
  ): Promise<User> {
    const meta = {
      accountId,
    };

    try {
      const updatedUser = await UserRepository.updateUserInfo(accountId, data);

      serviceLogger(
        "info",
        "UserService.updateUserInfo",
        `Обновлены данные пользователя ${JSON.stringify(data)}`,
        meta
      );

      return updatedUser;
    } catch (error) {
      serviceLogger(
        "error",
        "UserService.updateUserInfo",
        `Ошибка при обновлении данных пользователя ${JSON.stringify(data)}: ${
          (error as Error).message
        }`,
        meta
      );
      throw new Error("Ошибка при обновлении данных пользователя");
    }
  }
}
