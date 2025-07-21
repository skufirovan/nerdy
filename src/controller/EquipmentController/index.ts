import { EquipmentService } from "@core/index";
import { EquipmentDto } from "@domain/dtos";
import { UserEquipmentDto } from "@domain/dtos/UserEquipmentDto";
import { InMemoryCache } from "@infrastructure/cache";
import { EQUIPMENT_TYPE } from "@prisma/generated";

const TTL = 24 * 60 * 60 * 60 * 1000;
const cache = new InMemoryCache<"shop_equipment", EquipmentDto[]>(TTL);

export class EquipmentController {
  static async create(
    accountId: bigint,
    equipmentId: bigint,
    isEquipped: boolean = false
  ): Promise<UserEquipmentDto> {
    try {
      const equipment = await EquipmentService.create(
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

  static async findByAccountId(accountId: bigint): Promise<UserEquipmentDto[]> {
    try {
      const equipment = await EquipmentService.findUserEquipmentByAccountId(
        accountId
      );

      const dtos: UserEquipmentDto[] = equipment.map(
        (e) => new UserEquipmentDto(e)
      );
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async findShopEquipment(accountId: bigint): Promise<EquipmentDto[]> {
    try {
      const cacheKey = "shop_equipment";

      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const shopItems = await EquipmentService.findShopEquipment(accountId);

      const dtos = shopItems.map((s) => new EquipmentDto(s));

      cache.set(cacheKey, dtos);

      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async findEquipmentByBrandAndModel(
    accountId: bigint,
    brand: string,
    model: string
  ): Promise<EquipmentDto | null> {
    try {
      const equipment = await EquipmentService.findEquipmentByBrandAndModel(
        accountId,
        brand,
        model
      );

      if (!equipment) return null;

      const dto = new EquipmentDto(equipment);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findEquipped(accountId: bigint): Promise<UserEquipmentDto[]> {
    try {
      const equipment = await EquipmentService.findEquipped(accountId);

      const dtos: UserEquipmentDto[] = equipment.map(
        (e) => new UserEquipmentDto(e)
      );
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async findUserEquipmentByType(
    accountId: bigint,
    type: EQUIPMENT_TYPE
  ): Promise<UserEquipmentDto[]> {
    try {
      const equipment = await EquipmentService.findUserEquipmentByType(
        accountId,
        type
      );

      const dtos: UserEquipmentDto[] = equipment.map(
        (e) => new UserEquipmentDto(e)
      );
      return dtos;
    } catch (error) {
      throw error;
    }
  }
}
