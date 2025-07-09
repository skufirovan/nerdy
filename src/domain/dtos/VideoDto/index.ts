import { Video } from "@prisma/generated";

export class VideoDto {
  readonly accountId: bigint;
  readonly demoId: bigint;
  readonly description: string;
  readonly recordedAt: Date;

  constructor(video: Video) {
    this.accountId = video.accountId;
    this.demoId = video.demoId;
    this.description = video.description;
    this.recordedAt = video.recordedAt;
  }
}
