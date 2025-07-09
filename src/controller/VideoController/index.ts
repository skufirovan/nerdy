import { VideoService } from "@core/index";
import { VideoDto } from "@domain/dtos";

export class VideoController {
  static async create(
    accountId: bigint,
    demoId: bigint,
    description: string
  ): Promise<VideoDto> {
    try {
      const video = await VideoService.create(accountId, demoId, description);
      const dto = new VideoDto(video);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByAccountId(accountId: bigint): Promise<VideoDto[]> {
    try {
      const videos = await VideoService.findByAccountId(accountId);

      const dtos: VideoDto[] = videos.map((video) => new VideoDto(video));
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async delete(
    accountId: bigint,
    description: string
  ): Promise<VideoDto> {
    try {
      const video = await VideoService.delete(accountId, description);
      const dto = new VideoDto(video);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async canRecord(
    accountId: bigint
  ): Promise<{ canRecord: boolean; remainingTimeText?: string }> {
    try {
      const { canRecord, remainingTimeText } = await VideoService.canRecord(
        accountId
      );

      if (!canRecord) {
        return { canRecord: false, remainingTimeText: remainingTimeText! };
      }

      return { canRecord: true };
    } catch (error) {
      throw error;
    }
  }
}
