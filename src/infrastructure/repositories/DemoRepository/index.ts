import { prisma } from "@prisma/client";
import { Demo } from "@prisma/generated";

export class DemoRepository {
  static async create(
    accountId: bigint,
    name: string,
    text: string
  ): Promise<Demo> {
    return prisma.demo.create({
      data: {
        accountId,
        name,
        text,
      },
    });
  }

  static async findByAccountId(accountId: bigint): Promise<Demo[]> {
    return prisma.demo.findMany({
      where: { accountId },
      orderBy: { recordedAt: "desc" },
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
