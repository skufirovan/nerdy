import { prisma } from "@prisma/client";
import { Demo } from "@prisma/generated";
import { DemoWithUser, NON_UPDATABLE_DEMO_FIELDS } from "@domain/types";

export class DemoRepository {
  static async create(
    accountId: bigint,
    name: string,
    text: string | null,
    fileId: string | null,
    messageId: number | null
  ): Promise<Demo> {
    return prisma.demo.create({
      data: {
        accountId,
        name,
        text,
        fileId,
        messageId,
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

  static async updateDemoInfo(
    id: bigint,
    data: Partial<Omit<Demo, NON_UPDATABLE_DEMO_FIELDS>>
  ): Promise<Demo> {
    return prisma.demo.update({
      where: {
        id,
      },
      data,
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
