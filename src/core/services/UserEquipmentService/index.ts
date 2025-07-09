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
    const meta = {
      accountId,
    };

    try {
      const equipment = await UserEquipmentRepository.create(
        accountId,
        equipmentId,
        isEquipped
      );

      return equipment;
    } catch (error) {
      serviceLogger(
        "error",
        "UserEquipmentService.create",
        "Ошибка при создании оборудования",
        meta
      );
      throw new Error("Ошибка при создании оборудования");
    }
  }

  static async findByAccountId(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    const meta = {
      accountId,
    };

    try {
      const equipment = await UserEquipmentRepository.findByAccountId(
        accountId
      );
      return equipment;
    } catch (error) {
      serviceLogger(
        "error",
        "UserEquipmentService.findByAccountId",
        "Ошибка при поиске оборудования",
        meta
      );
      throw new Error("Ошибка при поиске оборудования");
    }
  }

  static async findEquipped(
    accountId: bigint
  ): Promise<UserEquipmentWithEquipment[]> {
    const meta = {
      accountId,
    };

    try {
      const equipment = await UserEquipmentRepository.findEquipped(accountId);
      return equipment;
    } catch (error) {
      serviceLogger(
        "error",
        "UserEquipmentService.findEquipped",
        "Ошибка при поиске выбранного оборудования",
        meta
      );
      throw new Error("Ошибка при поиске выбранного оборудования");
    }
  }

  static async findByType(
    accountId: bigint,
    type: EQUIPMENT_TYPE
  ): Promise<UserEquipmentWithEquipment[]> {
    const meta = {
      accountId,
    };

    try {
      const equipment = await UserEquipmentRepository.findByType(
        accountId,
        type
      );
      return equipment;
    } catch (error) {
      serviceLogger(
        "error",
        "UserEquipmentService.findByType",
        "Ошибка при поиске оборудования по типу",
        meta
      );
      throw new Error("Ошибка при поиске оборудования по типу");
    }
  }
}
