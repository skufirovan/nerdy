import { prisma } from "@prisma/client";
import { DistributedDemo } from "@prisma/generated";
import { DistributedDemoWithDemoAndLikes } from "@domain/types";

export class DistributedDemoRepository {
  static async createDistributedDemo(demoId: bigint): Promise<DistributedDemo> {
    return prisma.distributedDemo.create({
      data: { demoId },
    });
  }

  static async findByNameAndNickname(
    demoName: string,
    userNickname: string
  ): Promise<DistributedDemo | null> {
    return prisma.distributedDemo.findFirst({
      where: {
        demo: {
          name: demoName,
          user: {
            nickname: userNickname,
          },
        },
      },
    });
  }

  static async findByDemoId(demoId: bigint): Promise<DistributedDemo | null> {
    return prisma.distributedDemo.findUnique({
      where: {
        demoId,
      },
    });
  }

  static async findByDateRange(
    from: Date,
    to: Date
  ): Promise<DistributedDemoWithDemoAndLikes[]> {
    return prisma.distributedDemo.findMany({
      where: {
        createdAt: {
          gte: from,
          lt: to,
        },
      },
      include: {
        demo: {
          include: {
            user: true,
          },
        },
        likes: true,
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
    });
  }

  static async toggleLike(
    accountId: bigint,
    distributedDemoId: bigint
  ): Promise<boolean> {
    const existing = await prisma.distributedDemoLike.findUnique({
      where: {
        distributedDemoId_accountId: { distributedDemoId, accountId },
      },
    });

    if (existing) {
      await prisma.distributedDemoLike.delete({
        where: { id: existing.id },
      });
      return false;
    } else {
      await prisma.distributedDemoLike.create({
        data: { distributedDemoId, accountId },
      });
      return true;
    }
  }
}
