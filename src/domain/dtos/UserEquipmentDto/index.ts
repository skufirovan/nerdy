import { UserEquipmentWithEquipment } from "@domain/types";
import { EquipmentDto } from "../EquipmentDto";

export class UserEquipmentDto {
  readonly isEquipped: boolean;
  readonly createdAt: Date;
  readonly equipment: EquipmentDto;

  constructor(userEquipment: UserEquipmentWithEquipment) {
    this.isEquipped = userEquipment.isEquipped;
    this.createdAt = userEquipment.createdAt;
    this.equipment = new EquipmentDto(userEquipment.equipment);
  }
}
