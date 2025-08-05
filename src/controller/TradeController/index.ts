import { TradeService } from "@core/index";
import { Trade } from "@prisma/generated";
import { TradeWithUsersAndEquipments } from "@domain/types";
import { UserEquipmentDto } from "@domain/dtos";

export class TradeController {
  static async initiateTrade(
    initiatorId: bigint,
    receiverId: bigint,
    equipmentFrom?: UserEquipmentDto,
    racksFrom?: number
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      return await TradeService.initiateTrade(
        initiatorId,
        receiverId,
        equipmentFrom,
        racksFrom
      );
    } catch (error) {
      throw error;
    }
  }

  static async findById(
    accountId: bigint,
    tradeId: bigint
  ): Promise<TradeWithUsersAndEquipments | null> {
    try {
      return await TradeService.findById(accountId, tradeId);
    } catch (error) {
      throw error;
    }
  }

  static async cancelTrade(
    accountId: bigint,
    tradeId: bigint
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      return await TradeService.cancelTrade(accountId, tradeId);
    } catch (error) {
      throw error;
    }
  }

  static async acceptTrade(
    receiverId: bigint,
    tradeId: bigint
  ): Promise<Trade> {
    try {
      return await TradeService.acceptTrade(receiverId, tradeId);
    } catch (error) {
      throw error;
    }
  }

  static async selectTradeItems(
    receiverId: bigint,
    tradeId: bigint,
    equipmentTo?: UserEquipmentDto,
    racksTo?: number
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      return await TradeService.selectTradeItems(
        receiverId,
        tradeId,
        equipmentTo,
        racksTo
      );
    } catch (error) {
      throw error;
    }
  }

  static async completeTrade(
    accountId: bigint,
    tradeId: bigint
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      return await TradeService.completeTrade(accountId, tradeId);
    } catch (error) {
      throw error;
    }
  }
}
