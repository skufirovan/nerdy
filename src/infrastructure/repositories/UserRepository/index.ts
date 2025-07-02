import { prisma } from "@prisma/client";
import { User } from "@prisma/generated";
import { NON_UPDATABLE_USER_FIELDS } from "@domain/types";

export default class UserRepository {
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
