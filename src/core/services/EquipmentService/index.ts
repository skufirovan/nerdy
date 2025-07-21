import { EquipmentRepository } from "@infrastructure/repositories";
import { serviceLogger } from "@infrastructure/logger";
import { Equipment, EQUIPMENT_TYPE } from "@prisma/generated";
import { UserEquipmentWithEquipment } from "@domain/types";

export class EquipmentService {
  static async create(
    accountId: bigint,
    equipmentId: bigint,
    isEquipped: boolean = false
  ): Promise<UserEquipmentWithEquipment> {
    try {
      const equipment = await EquipmentRepository.create(
        accountId,
        equipmentId,
        isEquipped
      );

      serviceLogger(
        "info",
        "UserEquipmentService.create",
        `Полученая новая оборудка: ${equipmentId}`,
        { accountId }
      );

      return equipment;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserEquipmentService.create",
        `Ошибка при создании оборудования: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при создании оборудования");
    }
  }

  static async findShopEquipment(accountId: bigint): Promise<Equipment[]> {
    try {
      const shopItems = await EquipmentRepository.findShopEquipment();

      return shopItems;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "EquipmentService.getShopEquipment",
        `Ошибка при поиске продающегося оборудования: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске продающегося оборудования");
    }
  }

  static async findEquipmentByBrandAndModel(
    accountId: bigint,
    brand: string,
    model: string
  ): Promise<Equipment | null> {
    try {
      const equipment = await EquipmentRepository.findEquipmentByBrandAndModel(
        brand,
        model
      );

      return equipment;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "EquipmentService.findEquipmentByBrandAndModel",
        `Ошибка при поиске оборудования: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске оборудования");
    }
  }

  static async findUserEquipmentByAccountId(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await EquipmentRepository.findUserEquipmentByAccountId(
        accountId
      );
      return equipment;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserEquipmentService.findByAccountId",
        `Ошибка при поиске оборудования: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске оборудования");
    }
  }

  static async findEquipped(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await EquipmentRepository.findEquipped(accountId);
      return equipment;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserEquipmentService.findEquipped",
        `Ошибка при поиске выбранного оборудования: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске выбранного оборудования");
    }
  }

  static async findUserEquipmentByType(
    accountId: bigint,
    type: EQUIPMENT_TYPE
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await EquipmentRepository.findUserEquipmentByType(
        accountId,
        type
      );
      return equipment;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserEquipmentService.findByType",
        `Ошибка при поиске оборудования по типу: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске оборудования по типу");
    }
  }
}
