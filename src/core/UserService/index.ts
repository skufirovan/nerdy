import UserRepository from "@infrastructure/repositories/UserRepository";
import serviceLogger from "@infrastructure/logger/serviceLogger";
import { User } from "@prisma/generated";

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
      const updatedUser = await this.syncUsername(accountId, username);

      if (updatedUser) {
        return updatedUser;
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

  static async syncUsername(
    accountId: bigint,
    username: string | null
  ): Promise<User | null> {
    const meta = {
      accountId,
      username,
    };

    try {
      const user = await UserRepository.findByAccountId(accountId);

      if (!user) return null;
      if (user.username === username) return user;

      await UserRepository.updateField(accountId, "username", username);

      let message = "";
      const was = user.username;
      const now = username;

      if (!was && now) {
        message = `Установлен username: @${now}`;
      } else if (was && !now) {
        message = `Удалён username: был @${was}`;
      } else {
        message = `Сменил username: был @${was}, стал @${now}`;
      }

      serviceLogger("info", "UserService.syncUsername", message, meta);
      return { ...user, username };
    } catch (error) {
      serviceLogger(
        "error",
        "UserService.syncUsername",
        `Ошибка при обновлении username: ${(error as Error).message}`,
        meta
      );
      throw new Error("Ошибка при обновлении username");
    }
  }

  static async updateUserInfo<
    T extends keyof Omit<User, NON_UPDATABLE_USER_FIELDS>
  >(accountId: bigint, field: T, value: User[T]): Promise<User> {
    const meta = {
      accountId,
    };

    try {
      if (value === null || value === undefined) {
        throw new Error("Значение поля не должно быть null/undefined");
      }
      return await UserRepository.updateField(accountId, field, value);
    } catch (error) {
      serviceLogger(
        "error",
        "UserService.updateUserInfo",
        `Ошибка при обновлении данных пользователя ${field}: ${value}: ${
          (error as Error).message
        }`,
        meta
      );
      throw new Error("Ошибка при обновлении данных пользователя");
    }
  }
}
