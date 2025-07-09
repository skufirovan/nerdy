import { prisma } from "@prisma/client";
import { User } from "@prisma/generated";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";

export class UserRepository {
  static async create(
    accountId: bigint,
    username: string | null,
    nickname: string
  ): Promise<User> {
    return prisma.user.create({
      data: {
        accountId,
        username,
        nickname,
      },
    });
  }

  static async findByAccountId(accountId: bigint): Promise<User | null> {
    return prisma.user.findUnique({ where: { accountId } });
  }

  static async findByNickname(nickname: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { nickname } });
  }

  static async findTopUsersByField(
    field: keyof Pick<User, "fame" | "seasonalFame">,
    limit: number = 10
  ): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { [field]: "desc" },
      take: limit,
    });
  }

  static async updateUserInfo(
    accountId: bigint,
    data: Partial<Omit<User, NON_UPDATABLE_USER_FIELDS>>
  ): Promise<User> {
    return prisma.user.update({
      where: { accountId },
      data,
    });
  }
}
