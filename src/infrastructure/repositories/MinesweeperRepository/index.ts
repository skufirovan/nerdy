import { prisma } from "@prisma/client";
import { MinesweeperGame } from "@prisma/generated";

export class MinesweeperRepository {
  static async create(
    accountId: bigint,
    field: string,
    currentWin: number
  ): Promise<MinesweeperGame> {
    return prisma.minesweeperGame.create({
      data: { accountId, field, currentWin },
    });
  }

  static async findActiveByAccountId(
    accountId: bigint
  ): Promise<MinesweeperGame | null> {
    return prisma.minesweeperGame.findFirst({
      where: { accountId, isActive: true },
    });
  }

  static async update(
    id: bigint,
    data: { currentWin?: number; field?: string; isActive?: boolean }
  ): Promise<MinesweeperGame> {
    return prisma.minesweeperGame.update({
      where: { id },
      data,
    });
  }
}
