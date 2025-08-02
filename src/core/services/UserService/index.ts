import { UserRepository } from "@infrastructure/repositories";
import { UserError } from "@infrastructure/error";
import { EquipmentService } from "../EquipmentService";
import { calculateLevelAndRacks } from "@core/GameLogic";
import { serviceLogger } from "@infrastructure/logger";
import { User } from "@prisma/generated";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";
import { SquadService } from "../SquadService";

export class UserService {
  static async register(
    accountId: bigint,
    username: string | null,
    nickname: string,
    invitedById: bigint | null
  ): Promise<User> {
    const meta = {
      accountId,
      username,
    };

    try {
      const existingUser = await UserRepository.findByAccountId(accountId);

      if (existingUser) return existingUser;

      if (invitedById && invitedById !== accountId) {
        const inviting = await UserRepository.findByAccountId(invitedById);
        if (inviting) {
          await UserRepository.updateUserInfo(invitedById, {
            invitedUsersCount: inviting.invitedUsersCount + 1,
            racks: inviting.racks + 1000,
          });
        }
      }

      const newUser = await UserRepository.create(
        accountId,
        username,
        nickname,
        invitedById
      );
      await EquipmentService.create(accountId, BigInt(1), true);
      await EquipmentService.create(accountId, BigInt(2), true);
      await EquipmentService.create(accountId, BigInt(3), true);

      serviceLogger(
        "info",
        "UserService.register",
        "Новый пользователь зарегистрирован",
        meta
      );

      return newUser;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.register",
        `Ошибка регистрации: ${err}`,
        meta
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при регистрации пользователя");
    }
  }

  static async findByAccountId(accountId: bigint): Promise<User | null> {
    try {
      const user = await UserRepository.findByAccountId(accountId);

      if (user) {
        return user;
      }

      serviceLogger(
        "warn",
        "UserService.getByAccountId",
        "Пользователь не найден",
        { accountId }
      );

      return null;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.getByAccountId",
        `Ошибка получения пользователя: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при получении пользователя");
    }
  }

  static async findByNickname(
    accountId: bigint,
    nickname: string
  ): Promise<User | null> {
    try {
      const user = await UserRepository.findByNickname(nickname);

      if (user) {
        return user;
      }

      serviceLogger(
        "warn",
        "UserService.getByNickname",
        `Пользователь не найден по нику ${nickname}`,
        { accountId }
      );

      return null;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.getByNickname",
        `Ошибка получения пользователя по нику ${nickname}: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при получении пользователя по нику");
    }
  }

  static async findTopUsersByField(
    accountId: bigint,
    field: keyof Pick<User, "fame" | "seasonalFame">,
    limit: number = 10
  ): Promise<User[]> {
    try {
      const topUsers = await UserRepository.findTopUsersByField(field, limit);
      return topUsers;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.findTopUsersByField",
        `Ошибка получения рейтинга по полю ${field}: ${err}`,
        { accountId }
      );
      throw new Error(`Ошибка получения рейтинга по полю ${field}`);
    }
  }

  static async updateUserInfo(
    accountId: bigint,
    data: Partial<Omit<User, NON_UPDATABLE_USER_FIELDS>>
  ): Promise<User> {
    try {
      const updatedUser = await UserRepository.updateUserInfo(accountId, data);

      serviceLogger(
        "info",
        "UserService.updateUserInfo",
        `Обновлены данные пользователя ${JSON.stringify(data)}`,
        { accountId }
      );

      return updatedUser;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.updateUserInfo",
        `Ошибка при обновлении данных пользователя ${JSON.stringify(
          data
        )}: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при обновлении данных пользователя");
    }
  }

  static async addFame(accountId: bigint, amount: number): Promise<User> {
    try {
      const user = await UserRepository.findByAccountId(accountId);

      if (!user) throw new UserError(`Ты не зарегистрирован`);

      const updatedFame = user.fame + amount;
      const updatedSeasonalFame = user.seasonalFame + amount;
      const { level, racks } = calculateLevelAndRacks(user.level, updatedFame);

      const membership = await SquadService.findMembershipByUserId(accountId);

      if (membership) {
        await SquadService.updateSquadInfo(accountId, membership.squadName, {
          seasonalFame: membership.squad.seasonalFame + amount,
        });
      }

      if (level !== user.level) {
        const updatedUser = await UserRepository.updateUserInfo(accountId, {
          level,
          fame: updatedFame,
          seasonalFame: updatedSeasonalFame,
          racks: user.racks + racks,
        });

        serviceLogger(
          "info",
          "UserService.addFame",
          `Обновлены данные пользователя ${JSON.stringify({
            level,
            fame: updatedFame,
            seasonalFame: updatedSeasonalFame,
            racks: user.racks + racks,
          })}`,
          { accountId }
        );

        return updatedUser;
      }

      const updatedUser = await UserRepository.updateUserInfo(accountId, {
        fame: updatedFame,
        seasonalFame: updatedSeasonalFame,
      });

      serviceLogger(
        "info",
        "UserService.addFame",
        `Обновлены данные пользователя ${JSON.stringify({
          fame: updatedFame,
          seasonalFame: updatedSeasonalFame,
        })}`,
        { accountId }
      );

      return updatedUser;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.addFame",
        `Ошибка при добавлении фейма: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при добавлении фейма");
    }
  }

  static async subtractFame(accountId: bigint, amount: number): Promise<User> {
    try {
      const user = await UserRepository.findByAccountId(accountId);

      if (!user) throw new UserError(`Ты не зарегистрирован`);

      const updatedFame = user.fame - amount;
      const updatedSeasonalFame = user.seasonalFame - amount;

      const membership = await SquadService.findMembershipByUserId(accountId);

      if (membership) {
        await SquadService.updateSquadInfo(accountId, membership.squadName, {
          seasonalFame: membership.squad.seasonalFame - amount,
        });
      }

      const updatedUser = await UserRepository.updateUserInfo(accountId, {
        fame: updatedFame,
        seasonalFame: updatedSeasonalFame,
      });

      serviceLogger(
        "info",
        "UserService.subtractFame",
        `Обновлены данные пользователя ${JSON.stringify({
          fame: updatedFame,
          seasonalFame: updatedSeasonalFame,
        })}`,
        { accountId }
      );

      return updatedUser;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.subtractFame",
        `Ошибка при уменьшении фейма: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при уменьшении фейма");
    }
  }

  static async buyEquipment(
    accountId: bigint,
    brand: string,
    model: string
  ): Promise<User> {
    try {
      const user = await UserRepository.findByAccountId(accountId);

      if (!user) throw new UserError(`Ты не зарегистрирован`);

      const equipment = await EquipmentService.findEquipmentByBrandAndModel(
        accountId,
        brand,
        model
      );

      if (!equipment)
        throw new UserError(`Оборудование ${brand} ${model} не найдено`);

      const existedEquipment = await EquipmentService.findUserEquipment(
        accountId,
        equipment.id
      );
      if (existedEquipment) throw new UserError("У тебя уже есть эта оборудка");

      if (user.racks < equipment.price)
        throw new UserError("Не хватает рексов для покупки");

      const price = user.hasPass
        ? Math.floor(equipment.price * 0.9)
        : equipment.price;

      await EquipmentService.create(accountId, equipment.id);
      const updatedUser = await UserRepository.updateUserInfo(accountId, {
        racks: user.racks - price,
      });

      return updatedUser;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserService.buyEquipment",
        `Ошибка при покупке оборудования: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при покупке оборудования");
    }
  }
}
