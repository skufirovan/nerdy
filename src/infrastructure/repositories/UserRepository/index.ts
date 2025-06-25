import { prisma } from "@prisma/client";
import { User } from "@prisma/generated";

export default class UserRepository {
  static async create(accountId: bigint, username: string | null) {
    return prisma.user.create({
      data: {
        accountId,
        username,
      },
    });
  }

  static async findByAccountId(accountId: bigint) {
    return prisma.user.findUnique({ where: { accountId } });
  }

  static async updateField<
    T extends keyof Omit<User, "id" | "accountId" | "registeredAt">
  >(accountId: bigint, field: T, value: User[T]) {
    return prisma.user.update({
      where: { accountId },
      data: { [field]: value },
    });
  }
}
