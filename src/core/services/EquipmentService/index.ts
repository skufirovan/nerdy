import { EquipmentRepository } from "@infrastructure/repositories";
import { UserError } from "@infrastructure/error";
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

  static async findUserEquipment(
    accountId: bigint,
    equipmentId: bigint
  ): Promise<UserEquipmentWithEquipment | null> {
    try {
      const equipment = await EquipmentRepository.findUserEquipment(
        accountId,
        equipmentId
      );

      return equipment;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "EquipmentService.findUserEquipment",
        `Ошибка при поиске оборудования пользователя: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске оборудования пользователя");
    }
  }

  static async findUserEquipmentsByAccountId(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await EquipmentRepository.findUserEquipmentsByAccountId(
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

  static async findUserEquipped(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await EquipmentRepository.findUserEquipped(accountId);
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

  static async findUserEquipmentsByType(
    accountId: bigint,
    type: EQUIPMENT_TYPE
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await EquipmentRepository.findUserEquipmentsByType(
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

  static async equipUserEquipment(
    accountId: bigint,
    equipmentId: bigint
  ): Promise<UserEquipmentWithEquipment> {
    try {
      const existedEquipment = await EquipmentRepository.findUserEquipment(
        accountId,
        equipmentId
      );

      if (!existedEquipment) throw new UserError("Оборудка не найдена");

      const userEquipped = await EquipmentRepository.findUserEquipped(
        accountId
      );

      const prevEquipped = userEquipped.find(
        (u) => u.equipment.type === existedEquipment.equipment.type
      );

      if (prevEquipped) {
        if (prevEquipped.equipmentId === existedEquipment.equipmentId) {
          return existedEquipment;
        }

        await EquipmentRepository.unequipUserEquipment(
          accountId,
          prevEquipped.equipmentId
        );
      }

      return EquipmentRepository.equipUserEquipment(accountId, equipmentId);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "UserEquipmentService.equipUserEquipment",
        `Ошибка при активировании оборудования: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при активировании оборудования");
    }
  }
}
