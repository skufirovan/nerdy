import { DistributedDemoRepository } from "@infrastructure/repositories";
import { serviceLogger } from "@infrastructure/logger";
import { DistributedDemo } from "@prisma/generated";
import { DistributedDemoWithDemoAndLikes } from "@domain/types";
import { getLastTwoFridays } from "@utils/index";

export class DistributedDemoService {
  static async create(
    accountId: bigint,
    demoId: bigint
  ): Promise<DistributedDemo> {
    try {
      const distributedDemo =
        await DistributedDemoRepository.createDistributedDemo(demoId);

      serviceLogger(
        "info",
        "DistributedDemoService.create",
        "Демка отправлена на дистрибьюцию"
      );

      return distributedDemo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DistributedDemoService.create",
        `Ошибка при отправке демки ${demoId} на дистрибьюцию: ${err}`,
        { accountId }
      );
      throw new Error("Не удалось отправить демку на дистрибьюцию");
    }
  }

  static async findByNameAndNickname(
    accountId: bigint,
    demoName: string,
    userNickname: string
  ): Promise<DistributedDemo | null> {
    try {
      const distributedDemo =
        await DistributedDemoRepository.findByNameAndNickname(
          demoName,
          userNickname
        );
      return distributedDemo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DistributedDemoService.findByNameAndNickname",
        `Не удалось найти демку ${demoName}, отправленную на дистрибьюцию: ${err}`,
        { accountId, username: userNickname }
      );
      throw new Error(
        `Не удалось найти демку ${demoName}, отправленную на дистрибьюцию`
      );
    }
  }

  static async findByDemoId(
    accountId: bigint,
    demoId: bigint
  ): Promise<DistributedDemo | null> {
    try {
      const distributedDemo = await DistributedDemoRepository.findByDemoId(
        demoId
      );
      return distributedDemo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DistributedDemoService.findByDemoId",
        `Не удалось найти демку, отправленную на дистрибьюцию: ${err}`,
        { accountId }
      );
      throw new Error("Не удалось найти демку, отправленную на дистрибьюцию");
    }
  }

  static async getCurrentWeekDemos(
    accountId: bigint
  ): Promise<DistributedDemoWithDemoAndLikes[]> {
    try {
      const [from, to] = getLastTwoFridays();

      return await DistributedDemoRepository.findByDateRange(from, to);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DistributedDemoService.getCurrentWeekDemos",
        `Не удалось получить демки недели: ${err}`,
        { accountId }
      );
      throw new Error("Не удалось получить демки недели");
    }
  }

  static async toggleLike(
    accountId: bigint,
    distributedDemoId: bigint
  ): Promise<boolean> {
    try {
      const isLiked = await DistributedDemoRepository.toggleLike(
        accountId,
        distributedDemoId
      );
      return isLiked;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "DistributedDemoService.toggleLike",
        `Ошибка при переключении лайка на демке ${distributedDemoId}: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при переключении лайка");
    }
  }
}
