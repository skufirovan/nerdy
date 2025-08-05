import { prisma } from "@prisma/client";
import { Prisma, Trade } from "@prisma/generated";
import { TradeWithUsersAndEquipments } from "@domain/types";

export class TradeRepository {
  static async create(
    initiatorId: bigint,
    receiverId: bigint,
    equipmentFrom?: bigint,
    racksFrom?: number,
    expiresAt?: Date
  ): Promise<TradeWithUsersAndEquipments> {
    return prisma.trade.create({
      data: {
        initiatorId,
        receiverId,
        equipmentFrom,
        racksFrom,
        expiresAt,
      },
      include: {
        initiator: true,
        receiver: true,
        equipmentFromItem: true,
        equipmentToItem: true,
      },
    });
  }

  static async findById(
    id: bigint
  ): Promise<TradeWithUsersAndEquipments | null> {
    return prisma.trade.findUnique({
      where: { id },
      include: {
        initiator: true,
        receiver: true,
        equipmentFromItem: true,
        equipmentToItem: true,
      },
    });
  }

  static async findActiveByAccountId(
    accountId: bigint
  ): Promise<TradeWithUsersAndEquipments[]> {
    return prisma.trade.findMany({
      where: {
        OR: [{ initiatorId: accountId }, { receiverId: accountId }],
        status: { in: ["PENDING", "ACCEPTED", "RESPONDED"] },
        expiresAt: { gt: new Date() },
      },
      include: {
        initiator: true,
        receiver: true,
        equipmentFromItem: true,
        equipmentToItem: true,
      },
    });
  }

  static async update(
    id: bigint,
    data: Partial<Trade>
  ): Promise<TradeWithUsersAndEquipments> {
    return prisma.trade.update({
      where: { id },
      data,
      include: {
        initiator: true,
        receiver: true,
        equipmentFromItem: true,
        equipmentToItem: true,
      },
    });
  }

  static async completeTrade(
    tradeId: bigint
  ): Promise<TradeWithUsersAndEquipments | null> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const trade = await tx.trade.findUnique({ where: { id: tradeId } });
      if (!trade) return null;

      if (trade.racksFrom) {
        await tx.user.update({
          where: { accountId: trade.initiatorId },
          data: { racks: { decrement: trade.racksFrom } },
        });
        await tx.user.update({
          where: { accountId: trade.receiverId },
          data: { racks: { increment: trade.racksFrom } },
        });
      }

      if (trade.racksTo) {
        await tx.user.update({
          where: { accountId: trade.receiverId },
          data: { racks: { decrement: trade.racksTo } },
        });
        await tx.user.update({
          where: { accountId: trade.initiatorId },
          data: { racks: { increment: trade.racksTo } },
        });
      }

      if (trade.equipmentFrom) {
        await tx.userEquipment.update({
          where: { id: trade.equipmentFrom },
          data: { accountId: trade.receiverId },
        });
      }

      if (trade.equipmentTo) {
        await tx.userEquipment.update({
          where: { id: trade.equipmentTo },
          data: { accountId: trade.initiatorId },
        });
      }

      return await tx.trade.update({
        where: { id: tradeId },
        data: { status: "COMPLETED" },
        include: {
          initiator: true,
          receiver: true,
          equipmentFromItem: true,
          equipmentToItem: true,
        },
      });
    });
  }
}
