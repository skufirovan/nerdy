import { UserService } from "@core/index";
import { DemoRepository } from "@infrastructure/repositories";
import { serviceLogger } from "@infrastructure/logger";
import { getWaitingTime, getRemainingTimeText } from "@core/GameLogic";
import { DemoWithUser, NON_UPDATABLE_DEMO_FIELDS } from "@domain/types";
import { Demo } from "@prisma/generated";
import { getLastFriday } from "@utils/index";

export class DemoService {
  static async create(
    accountId: bigint,
    name: string,
    text: string | null,
    fileId: string | null,
    messageId: number | null
  ): Promise<Demo> {
    try {
      const demos = await DemoRepository.findByAccountId(accountId);

      if (demos.some((demo) => demo.name === name)) {
        throw new Error("Демка с таким названием уже существует");
      }

      const demo = await DemoRepository.create(
        accountId,
        name,
        text,
        fileId,
        messageId
      );
      await UserService.updateUserInfo(accountId, {
        lastDemoRecordedAt: new Date(),
      });

      serviceLogger("info", "DemoService.create", "Новая демка создана", {
        accountId,
      });

      return demo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DemoService.create",
        `Ошибка при создании демки: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при создании демки");
    }
  }

  static async findByAccountId(accountId: bigint): Promise<Demo[]> {
    try {
      const demos = await DemoRepository.findByAccountId(accountId);
      return demos;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DemoService.findByAccountId",
        `Ошибка при поиске демок: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске демок");
    }
  }

  static async findByName(
    accountId: bigint,
    name: string
  ): Promise<DemoWithUser | null> {
    try {
      const demo = await DemoRepository.findByName(accountId, name);
      return demo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DemoService.findByName",
        `Ошибка при поиске демки: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске демки");
    }
  }

  static async updateDemoInfo(
    accountId: bigint,
    id: bigint,
    data: Partial<Omit<Demo, NON_UPDATABLE_DEMO_FIELDS>>
  ): Promise<Demo> {
    try {
      const updatedDemo = await DemoRepository.updateDemoInfo(id, data);

      return updatedDemo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DemoService.updateDemoInfo",
        `Ошибка при обновлении демки: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при обновлении демки");
    }
  }

  static async delete(accountId: bigint, name: string): Promise<Demo> {
    try {
      const deletedDemo = await DemoRepository.delete(accountId, name);
      serviceLogger("info", "DemoService.delete", "Демка удалена", {
        accountId,
      });
      return deletedDemo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DemoService.delete",
        `Ошибка при удалении демки: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при удалении демки");
    }
  }

  static async canRecord(accountId: bigint): Promise<{
    canRecord: boolean;
    remainingTimeText?: string;
  }> {
    try {
      const user = await UserService.findByAccountId(accountId);
      if (!user) throw new Error("Пользователь не найден");

      const WAITING_TIME = getWaitingTime(user.hasPass).recordDemoRT;

      const now = Date.now();
      const lastRecorded = user.lastDemoRecordedAt?.getTime() ?? 0;
      const timeSinceLastRecord = now - lastRecorded;

      if (timeSinceLastRecord >= WAITING_TIME) {
        return { canRecord: true };
      } else {
        return {
          canRecord: false,
          remainingTimeText: getRemainingTimeText(
            WAITING_TIME - timeSinceLastRecord
          ),
        };
      }
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DemoService.canRecord",
        `Ошибка при проверке возможности записи демки: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при проверке возможности записи демки");
    }
  }

  static async canDistribute(accountId: bigint): Promise<boolean> {
    try {
      const user = await UserService.findByAccountId(accountId);
      if (!user) throw new Error(`Пользователь не найден ${accountId}`);

      const now = new Date();
      const currentFriday = getLastFriday(now);

      const lastDistributedAt = user.lastDemoDistributedAt;
      if (!lastDistributedAt || lastDistributedAt < currentFriday) {
        return true;
      }

      return false;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DemoService.canDistribute",
        `Ошибка при проверке возможности дистрибьюции демки: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при проверке возможности дистрибьюции демки");
    }
  }
}
