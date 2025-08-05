import { TradeRepository } from "@infrastructure/repositories";
import { UserService, EquipmentService } from "@core/index";
import { UserError } from "@infrastructure/error";
import { serviceLogger } from "@infrastructure/logger";
import { Trade } from "@prisma/generated";
import { UserEquipmentDto } from "@domain/dtos";
import { TradeWithUsersAndEquipments } from "@domain/types";

export class TradeService {
  static async initiateTrade(
    initiatorId: bigint,
    receiverId: bigint,
    equipmentFrom?: UserEquipmentDto,
    racksFrom?: number
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      if (initiatorId === receiverId)
        throw new UserError("Нельзя трейдиться с самим собой");

      if (!equipmentFrom && !racksFrom)
        throw new UserError("Ничего не выбрано для трейда");

      const initiator = await UserService.findByAccountId(initiatorId);
      if (!initiator) throw new UserError("Ты не зарегистрирован");

      const activeTrades = await TradeRepository.findActiveByAccountId(
        initiatorId
      );
      if (activeTrades.length > 0)
        throw new UserError("У тебя уже есть активный трейд");

      if (typeof racksFrom === "number" && racksFrom > initiator.racks)
        throw new UserError("Недостаточно рексов");

      if (equipmentFrom) {
        if (equipmentFrom.accountId !== initiatorId) {
          throw new UserError("Это оборудование уже не принадлежит тебе");
        }
        if (equipmentFrom.isEquipped) {
          throw new UserError("Активное оборудование нельзя трейдить");
        }
      }

      const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

      return TradeRepository.create(
        initiatorId,
        receiverId,
        equipmentFrom?.id,
        racksFrom,
        expiresAt
      );
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "TradeService.initiateTrade",
        `Ошибка при создании трейда: ${err}`,
        { accountId: initiatorId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при создании трейда");
    }
  }

  static async findById(
    accountId: bigint,
    tradeId: bigint
  ): Promise<TradeWithUsersAndEquipments | null> {
    try {
      return await TradeRepository.findById(tradeId);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "TradeService.findById",
        `Ошибка при поиске трейда: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при поиске трейда");
    }
  }

  static async cancelTrade(
    accountId: bigint,
    tradeId: bigint
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      const trade = await TradeRepository.findById(tradeId);

      if (!trade) throw new UserError("Трейд не найден");

      if (
        (trade.receiverId === accountId &&
          trade.status === "PENDING" &&
          trade.expiresAt! > new Date()) ||
        (trade.initiatorId == accountId &&
          trade.status === "RESPONDED" &&
          trade.expiresAt! > new Date())
      )
        return await TradeRepository.update(tradeId, { status: "CANCELLED" });

      throw new UserError("Трейд не доступен");
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "TradeService.cancelTrade",
        `Ошибка при отмене трейда: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при отмене трейда");
    }
  }

  static async acceptTrade(
    receiverId: bigint,
    tradeId: bigint
  ): Promise<Trade> {
    try {
      const activeTrades = await TradeRepository.findActiveByAccountId(
        receiverId
      );

      if (activeTrades.some((t) => t.id !== tradeId))
        throw new UserError("У тебя уже есть активный трейд");

      const trade = activeTrades.find((t) => t.id === tradeId);

      if (
        !trade ||
        trade.receiverId !== receiverId ||
        trade.status !== "PENDING"
      )
        throw new UserError("Трейд не доступен");

      if (
        trade.equipmentFromItem &&
        trade.equipmentFromItem.accountId !== trade.initiatorId
      )
        throw new UserError("Оборудование больше не принадлежит инициатору");

      if (trade.equipmentFromItem) {
        const existed = await EquipmentService.findUserEquipment(
          receiverId,
          trade.equipmentFromItem.equipmentId
        );
        if (existed) {
          await TradeRepository.update(tradeId, { status: "CANCELLED" });
          throw new UserError(
            `У тебя уже есть ${existed.equipment.brand} ${existed.equipment.model}`
          );
        }
      }

      const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
      return await TradeRepository.update(tradeId, {
        status: "ACCEPTED",
        expiresAt,
      });
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "TradeService.acceptTrade",
        `Ошибка при принятии трейда: ${err}`,
        { accountId: receiverId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при принятии трейда");
    }
  }

  static async selectTradeItems(
    receiverId: bigint,
    tradeId: bigint,
    equipmentTo?: UserEquipmentDto,
    racksTo?: number
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      if (!equipmentTo && !racksTo)
        throw new UserError("Ничего не выбрано для трейда");

      const activeTrades = await TradeRepository.findActiveByAccountId(
        receiverId
      );

      if (activeTrades.some((t) => t.id !== tradeId))
        throw new UserError("У тебя уже есть активный трейд");

      const trade = activeTrades.find((t) => t.id === tradeId);

      if (
        !trade ||
        trade.receiverId !== receiverId ||
        trade.status !== "ACCEPTED"
      )
        throw new UserError("Трейд не доступен");

      const receiver = trade.receiver;

      if (typeof racksTo === "number" && racksTo > receiver.racks)
        throw new UserError("Недостаточно рексов");

      if (equipmentTo) {
        if (equipmentTo.accountId !== receiverId) {
          throw new UserError("Это оборудование уже не принадлежит тебе");
        }
        if (equipmentTo.isEquipped) {
          throw new UserError("Активное оборудование нельзя трейдить");
        }
      }

      const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
      return await TradeRepository.update(tradeId, {
        equipmentTo: equipmentTo?.id,
        racksTo,
        expiresAt,
        status: "RESPONDED",
      });
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "TradeService.selectTradeItems",
        `Ошибка при ответном предложении на трейд: ${err}`,
        { accountId: receiverId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка ответном предложении на трейд");
    }
  }

  static async completeTrade(
    accountId: bigint,
    tradeId: bigint
  ): Promise<TradeWithUsersAndEquipments> {
    try {
      const activeTrades = await TradeRepository.findActiveByAccountId(
        accountId
      );

      if (activeTrades.some((t) => t.id !== tradeId))
        throw new UserError("У тебя уже есть активный трейд");

      const trade = activeTrades.find((t) => t.id === tradeId);

      if (
        !trade ||
        trade.initiatorId !== accountId ||
        trade.status !== "RESPONDED"
      )
        throw new UserError("Трейд не доступен");

      if (trade.racksFrom && trade.racksTo) {
        await TradeRepository.update(tradeId, { status: "CANCELLED" });
        throw new UserError("Нельзя трейдить рексы на рексы");
      }

      const initiator = trade.initiator;
      const receiver = trade.receiver;

      if (trade.equipmentToItem) {
        const existed = await EquipmentService.findUserEquipment(
          initiator.accountId,
          trade.equipmentToItem.equipmentId
        );
        if (existed) {
          await TradeRepository.update(tradeId, { status: "CANCELLED" });
          throw new UserError(
            `У тебя уже есть ${existed.equipment.brand} ${existed.equipment.model}`
          );
        }
      }

      if (
        (trade.racksFrom && initiator.racks < trade.racksFrom) ||
        (trade.racksTo && receiver.racks < trade.racksTo)
      ) {
        await TradeRepository.update(tradeId, { status: "CANCELLED" });
        throw new UserError("Недостаточно рексов для завершения трейда");
      }

      if (
        trade.equipmentFromItem &&
        trade.equipmentFromItem.accountId !== initiator.accountId
      ) {
        await TradeRepository.update(tradeId, { status: "CANCELLED" });
        throw new UserError("У создателя трейда больше нет этой оборудки");
      }

      if (
        trade.equipmentToItem &&
        trade.equipmentToItem.accountId !== receiver.accountId
      ) {
        await TradeRepository.update(tradeId, { status: "CANCELLED" });
        throw new UserError("У получателя трейда больше нет этой оборудки");
      }

      const completed = await TradeRepository.completeTrade(tradeId);

      if (!completed) {
        await TradeRepository.update(tradeId, { status: "CANCELLED" });
        throw new Error("Не удалось завершить трейд");
      }

      return completed;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "TradeService.completeTrade",
        `Ошибка при завершении трейда: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка завершении трейда");
    }
  }
}
