import DemoRepository from "@infrastructure/repositories/DemoRepository";
import { Demo } from "@prisma/generated";
import UserService from "@core/UserService";
import { getWaitingTime, getRemainingTimeText } from "@utils/index";

export default class DemoService {
  static async create(
    accountId: bigint,
    name: string,
    text: string
  ): Promise<Demo> {
    try {
      const demos = await this.findByAccountId(accountId);

      if (demos.some((demo) => demo.name === name)) {
        throw new Error("Демка с таким названием уже существует");
      }

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
      throw new Error("Ошибка DemoService.canRecord");
    }
  }
}
