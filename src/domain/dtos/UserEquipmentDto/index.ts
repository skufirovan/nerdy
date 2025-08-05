import { UserEquipmentWithEquipment } from "@domain/types";
import { EquipmentDto } from "../EquipmentDto";

export class UserEquipmentDto {
  readonly id: bigint;
  readonly accountId: bigint;
  readonly equipmentId: bigint;
  readonly isEquipped: boolean;
  readonly createdAt: Date;
  readonly equipment: EquipmentDto;

  constructor(userEquipment: UserEquipmentWithEquipment) {
    this.id = userEquipment.id;
    this.accountId = userEquipment.accountId;
    this.equipmentId = userEquipment.equipmentId;
    this.isEquipped = userEquipment.isEquipped;
    this.createdAt = userEquipment.createdAt;
    this.equipment = new EquipmentDto(userEquipment.equipment);
  }
}
