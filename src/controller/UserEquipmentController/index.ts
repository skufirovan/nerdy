import { UserEquipmentService } from "@core/index";
import { UserEquipmentDto } from "@domain/dtos/UserEquipmentDto";
import { EQUIPMENT_TYPE } from "@prisma/generated";

export class UserEquipmentController {
  static async create(
    accountId: bigint,
    equipmentId: bigint,
    isEquipped: boolean = false
  ): Promise<UserEquipmentDto> {
    try {
      const equipment = await UserEquipmentService.create(
        accountId,
        equipmentId,
        isEquipped
      );

      const dto = new UserEquipmentDto(equipment);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByAccountId(
    accountId: bigint
  ): Promise<UserEquipmentDto[] | null> {
    try {
      const equipment = await UserEquipmentService.findByAccountId(accountId);

      const dtos: UserEquipmentDto[] = equipment.map(
        (e) => new UserEquipmentDto(e)
      );
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async findEquipped(
    accountId: bigint
  ): Promise<UserEquipmentDto[] | null> {
    try {
      const equipment = await UserEquipmentService.findEquipped(accountId);

      const dtos: UserEquipmentDto[] = equipment.map(
        (e) => new UserEquipmentDto(e)
      );
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async findByType(
    accountId: bigint,
    type: EQUIPMENT_TYPE
  ): Promise<UserEquipmentDto[] | null> {
    try {
      const equipment = await UserEquipmentService.findByType(accountId, type);

      const dtos: UserEquipmentDto[] = equipment.map(
        (e) => new UserEquipmentDto(e)
      );
      return dtos;
    } catch (error) {
      throw error;
    }
  }
}
