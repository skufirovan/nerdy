import { prisma } from "@prisma/client";
import { Video } from "@prisma/generated";

export class VideoRepository {
  static async create(
    accountId: bigint,
    demoId: bigint,
    description: string
  ): Promise<Video> {
    return prisma.video.create({
      data: {
        accountId,
        demoId,
        description,
      },
    });
  }

  static async findByAccountId(accountId: bigint): Promise<Video[]> {
    return prisma.video.findMany({
      where: { accountId },
      orderBy: { recordedAt: "desc" },
    });
  }

  static async delete(accountId: bigint, description: string): Promise<Video> {
    return prisma.video.delete({
      where: {
        accountId_description: {
          accountId,
          description,
        },
      },
    });
  }
}
