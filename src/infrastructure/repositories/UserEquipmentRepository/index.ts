import { UserEquipmentWithEquipment } from "@domain/types";
import { prisma } from "@prisma/client";
import { EQUIPMENT_TYPE } from "@prisma/generated";

export class UserEquipmentRepository {
  static async create(
    accountId: bigint,
    equipmentId: bigint,
    isEquipped: boolean = false
  ): Promise<UserEquipmentWithEquipment> {
    return prisma.userEquipment.create({
      data: {
        accountId,
        equipmentId,
        isEquipped,
      },
      include: {
        equipment: true,
      },
    });
  }

  static async findByAccountId(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    return prisma.userEquipment.findMany({
      where: { accountId },
      include: {
        equipment: true,
      },
    });
  }

  static async findEquipped(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    return prisma.userEquipment.findMany({
      where: { accountId, isEquipped: true },
      include: {
        equipment: true,
      },
    });
  }

  static async findByType(
    accountId: bigint,
    type: EQUIPMENT_TYPE
  ): Promise<UserEquipmentWithEquipment[]> {
    return prisma.userEquipment.findMany({
      where: {
        accountId,
        equipment: {
          type,
        },
      },
      include: {
        equipment: true,
      },
    });
  }
}
