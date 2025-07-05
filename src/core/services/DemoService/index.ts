import { DemoRepository } from "@infrastructure/repositories";
import serviceLogger from "@infrastructure/logger/serviceLogger";
import { Demo } from "@prisma/generated";
import { getWaitingTime, getRemainingTimeText } from "@core/GameLogic";
import { UserService } from "@core/index";

export class DemoService {
  static async create(
    accountId: bigint,
    name: string,
    text: string
  ): Promise<Demo> {
    const meta = {
      accountId,
    };

    try {
      const demos = await this.findByAccountId(accountId);

      if (demos.some((demo) => demo.name === name)) {
        throw new Error("Демка с таким названием уже существует");
      }

      const demo = await DemoRepository.create(accountId, name, text);
      await UserService.updateUserInfo(accountId, {
        lastDemoRecordedAt: new Date(),
      });

      serviceLogger("info", "DemoService.create", "Новая демка создана", meta);

      return demo;
    } catch (error) {
      serviceLogger(
        "error",
        "DemoService.create",
        "Ошибка при создании демки",
        meta
      );
      throw new Error("Ошибка при создании демки");
    }
  }

  static async findByAccountId(accountId: bigint): Promise<Demo[]> {
    const meta = { accountId };

    try {
      const demos = await DemoRepository.findByAccountId(accountId);
      return demos;
    } catch (error) {
      serviceLogger(
        "error",
        "DemoService.findByAccountId",
        "Ошибка при получении демок",
        meta
      );
      throw new Error("Ошибка при получении демок");
    }
  }

  static async delete(accountId: bigint, name: string): Promise<Demo> {
    const meta = { accountId };

    try {
      const deletedDemo = await DemoRepository.delete(accountId, name);
      return deletedDemo;
    } catch (error) {
      serviceLogger(
        "error",
        "DemoService.delete",
        "Ошибка при удалении демки",
        meta
      );
      throw new Error("Ошибка при удалении демки");
    }
  }

  static async canRecord(accountId: bigint): Promise<{
    canRecord: boolean;
    remainingTimeText?: string;
  }> {
    const meta = { accountId };

    try {
      const user = await UserService.getByAccountId(accountId);
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
      serviceLogger(
        "error",
        "DemoService.canRecord",
        "Ошибка при проверке возможности записи демки",
        meta
      );
      throw new Error("Ошибка при проверке возможности записи демки");
    }
  }
}
