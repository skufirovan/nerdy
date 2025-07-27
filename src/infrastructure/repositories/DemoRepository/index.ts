import { prisma } from "@prisma/client";
import { Demo } from "@prisma/generated";
import { DemoWithUser } from "@domain/types";

export class DemoRepository {
  static async create(
    accountId: bigint,
    name: string,
    text: string | null,
    fileId: string | null
  ): Promise<Demo> {
    return prisma.demo.create({
      data: {
        accountId,
        name,
        text,
        fileId,
      },
    });
  }

  static async findByAccountId(accountId: bigint): Promise<Demo[]> {
    return prisma.demo.findMany({
      where: { accountId },
      orderBy: { recordedAt: "desc" },
    });
  }

  static async findByName(
    accountId: bigint,
    name: string
  ): Promise<DemoWithUser | null> {
    return prisma.demo.findUnique({
      where: { accountId_name: { accountId, name } },
      include: { user: true },
    });
  }

  static async delete(accountId: bigint, name: string): Promise<Demo> {
    return prisma.demo.delete({
      where: {
        accountId_name: {
          accountId,
          name,
        },
      },
    });
  }
}
