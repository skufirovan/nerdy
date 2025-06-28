import DemoRepository from "@infrastructure/repositories/DemoRepository";
import UserRepository from "@infrastructure/repositories/UserRepository";
import { Demo } from "@prisma/generated";
import UserService from "@core/UserService";
import { getWaitingTime } from "@utils/index";

export default class DemoService {
  static async create(
    accountId: bigint,
    name: string,
    text: string
  ): Promise<Demo> {
    try {
      await UserService.updateUserInfo(accountId, {
        lastDemoRecordedAt: new Date(),
      });
      return await DemoRepository.create(accountId, name, text);
    } catch (error) {
      throw new Error("Ошибка при записи демки");
    }
  }

  static async findByAccountId(accountId: bigint): Promise<Demo[]> {
    try {
      return await DemoRepository.findByAccountId(accountId);
    } catch (error) {
      throw new Error("Ошибка при поиске демок");
    }
  }

  static async delete(accountId: bigint, name: string): Promise<Demo> {
    try {
      return await DemoRepository.delete(accountId, name);
    } catch (error) {
      throw new Error("Ошибка при удалении демки");
    }
  }

  static async canRecord(accountId: bigint): Promise<{
    canRecord: boolean;
    remainingTimeText?: string;
  }> {
    try {
      const user = await UserRepository.findByAccountId(accountId);
      if (!user) throw new Error("User not found");

      const WAITING_TIME = getWaitingTime(user.hasPass).recordDemoRT;

      const now = Date.now();
      const lastRecorded = user.lastDemoRecordedAt?.getTime() ?? 0;
      const timeSinceLastRecord = now - lastRecorded;

      if (timeSinceLastRecord >= WAITING_TIME) {
        return { canRecord: true };
      } else {
        const remainingTimeMs = WAITING_TIME - timeSinceLastRecord;
        const remainingHours = Math.floor(remainingTimeMs / (60 * 60 * 1000));
        const remainingMinutes = Math.ceil(
          (remainingTimeMs % (60 * 60 * 1000)) / (60 * 1000)
        );

        return {
          canRecord: false,
          remainingTimeText: `${remainingHours} ч ${remainingMinutes} мин`,
        };
      }
    } catch (error) {
      throw new Error("Ошибка DemoService.canRecord");
    }
  }
}
