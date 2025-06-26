import UserRepository from "@infrastructure/repositories/UserRepository";
import serviceLogger from "@infrastructure/logger/serviceLogger";
import { User } from "@prisma/generated";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";

export default class UserService {
  static async register(
    accountId: bigint,
    username: string | null
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

      const newUser = await UserRepository.create(accountId, username);

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

  static async updateUserInfo(
    accountId: bigint,
    data: Partial<Omit<User, NON_UPDATABLE_USER_FIELDS>>
  ): Promise<User> {
    const meta = {
      accountId,
    };

    try {
      serviceLogger(
        "info",
        "UserService.updateUserInfo",
        `Обновлены данные пользователя ${data}`,
        meta
      );
      return await UserRepository.updateUserInfo(accountId, data);
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
