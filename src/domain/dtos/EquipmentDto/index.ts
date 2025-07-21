import { Equipment, EQUIPMENT_TYPE } from "@prisma/generated";

export class EquipmentDto {
  readonly id: bigint;
  readonly type: EQUIPMENT_TYPE;
  readonly brand: string;
  readonly model: string;
  readonly price: number;
  readonly multiplier: number;

  constructor(equipment: Equipment) {
    this.id = equipment.id;
    this.type = equipment.type;
    this.brand = equipment.brand;
    this.model = equipment.model;
    this.price = equipment.price;
    this.multiplier = equipment.multiplier;
  }
}
