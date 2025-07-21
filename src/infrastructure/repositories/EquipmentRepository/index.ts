import { UserEquipmentWithEquipment } from "@domain/types";
import { prisma } from "@prisma/client";
import { Equipment, EQUIPMENT_TYPE } from "@prisma/generated";

export class EquipmentRepository {
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

  static async findShopEquipment(): Promise<Equipment[]> {
    return prisma.equipment.findMany({ where: { inShop: true } });
  }

  static async findEquipmentByBrandAndModel(
    brand: string,
    model: string
  ): Promise<Equipment | null> {
    return prisma.equipment.findUnique({
      where: { brand_model: { brand, model } },
    });
  }

  static async findUserEquipment(
    accountId: bigint,
    equipmentId: bigint
  ): Promise<UserEquipmentWithEquipment | null> {
    return prisma.userEquipment.findUnique({
      where: { accountId_equipmentId: { accountId, equipmentId } },
      include: { equipment: true },
    });
  }

  static async findUserEquipmentsByAccountId(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    return prisma.userEquipment.findMany({
      where: { accountId },
      include: {
        equipment: true,
      },
    });
  }

  static async findUserEquipped(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    return prisma.userEquipment.findMany({
      where: { accountId, isEquipped: true },
      include: {
        equipment: true,
      },
    });
  }

  static async findUserEquipmentsByType(
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

  static async equipUserEquipment(
    accountId: bigint,
    equipmentId: bigint
  ): Promise<UserEquipmentWithEquipment> {
    return prisma.userEquipment.update({
      where: { accountId_equipmentId: { accountId, equipmentId } },
      data: { isEquipped: true },
      include: { equipment: true },
    });
  }

  static async unequipUserEquipment(
    accountId: bigint,
    equipmentId: bigint
  ): Promise<UserEquipmentWithEquipment> {
    return prisma.userEquipment.update({
      where: { accountId_equipmentId: { accountId, equipmentId } },
      data: { isEquipped: false },
      include: { equipment: true },
    });
  }
}
