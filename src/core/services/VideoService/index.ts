import { VideoRepository } from "@infrastructure/repositories";
import serviceLogger from "@infrastructure/logger/serviceLogger";
import { UserService } from "@core/index";
import { getWaitingTime, getRemainingTimeText } from "@core/GameLogic";
import { Video } from "@prisma/generated";

export class VideoService {
  static async create(
    accountId: bigint,
    demoId: bigint,
    description: string
  ): Promise<Video> {
    try {
      const videos = await this.findByAccountId(accountId);

      if (videos.some((video) => video.description === description)) {
        throw new Error("Видео с таким описанием уже существует");
      }

      const video = await VideoRepository.create(
        accountId,
        demoId,
        description
      );
      await UserService.updateUserInfo(accountId, {
        lastVideoRecordedAt: new Date(),
      });

      serviceLogger("info", "VideoService.create", "Создано новое видео", {
        accountId,
      });

      return video;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "VideoService.create",
        `Ошибка при создании видео: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при создании видео");
    }
  }

  static async findByAccountId(accountId: bigint): Promise<Video[]> {
    try {
      const videos = await VideoRepository.findByAccountId(accountId);
      return videos;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "VideoService.findByAccountId",
        `Ошибка при поиске видео: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске видео");
    }
  }

  static async delete(accountId: bigint, description: string): Promise<Video> {
    try {
      const deletedVideo = await VideoRepository.delete(accountId, description);
      return deletedVideo;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "VideoService.delete",
        `Ошибка при удалении видео: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при удалении видео");
    }
  }

  static async canRecord(accountId: bigint): Promise<{
    canRecord: boolean;
    remainingTimeText?: string;
  }> {
    try {
      const user = await UserService.findByAccountId(accountId);
      if (!user) throw new Error("Пользователь не найден");

      const WAITING_TIME = getWaitingTime(user.hasPass).recordVideoRT;

      const now = Date.now();
      const lastRecorded = user.lastVideoRecordedAt?.getTime() ?? 0;
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
        "VideoService.canRecord",
        `Ошибка при проверке возможности записи видео: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при проверке возможности записи видео");
    }
  }
}
