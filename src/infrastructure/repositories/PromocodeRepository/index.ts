import { prisma } from "@prisma/client";
import { Promocode, UserPromocode } from "@prisma/generated";

export class PromocodeRepository {
  static async usePromocode(
    accountId: bigint,
    promocodeId: bigint
  ): Promise<UserPromocode> {
    return prisma.userPromocode.create({
      data: { accountId, promocodeId },
    });
  }

  static async findByCode(code: string): Promise<Promocode | null> {
    return prisma.promocode.findUnique({
      where: { code },
    });
  }

  static async hasUsedPromocode(
    accountId: bigint,
    promocodeId: bigint
  ): Promise<UserPromocode | null> {
    return prisma.userPromocode.findUnique({
      where: { accountId_promocodeId: { accountId, promocodeId } },
    });
  }

  static async countUses(promocodeId: bigint): Promise<number> {
    return prisma.userPromocode.count({
      where: { promocodeId },
    });
  }
}
