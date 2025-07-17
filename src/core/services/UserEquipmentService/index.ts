import { UserEquipmentRepository } from "@infrastructure/repositories";
import serviceLogger from "@infrastructure/logger/serviceLogger";
import { EQUIPMENT_TYPE } from "@prisma/generated";
import { UserEquipmentWithEquipment } from "@domain/types";

export class UserEquipmentService {
  static async create(
    accountId: bigint,
    equipmentId: bigint,
    isEquipped: boolean = false
  ): Promise<UserEquipmentWithEquipment> {
    try {
      const equipment = await UserEquipmentRepository.create(
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

  static async findByAccountId(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await UserEquipmentRepository.findByAccountId(
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
      const equipment = await UserEquipmentRepository.findEquipped(accountId);
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

  static async findByType(
    accountId: bigint,
    type: EQUIPMENT_TYPE
  ): Promise<UserEquipmentWithEquipment[]> {
    try {
      const equipment = await UserEquipmentRepository.findByType(
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
