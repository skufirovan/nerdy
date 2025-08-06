import path from "path";
import { MyContext, SessionData } from "../scenes";
import { TradeController, EquipmentController } from "@controller/index";
import { UserEquipmentDto } from "@domain/dtos";
import { getTradeKeyboard, getTradeOneKeyboard } from "./keyboard";
import { formatPaginated } from "../pagination/action";
import { getESMPaths, getRandomImage } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const renderTradeEquipment = async (
  ctx: MyContext,
  isInitiator: boolean,
  tradeId?: bigint
) => {
  const accountId = ctx.user!.accountId;
  const allEquipment = await EquipmentController.findUserEquipmentsByAccountId(
    accountId
  );

  if (!isInitiator && !tradeId)
    return ctx.reply(`${SECTION_EMOJI} Че то ты не туда попал, ниггер`);

  const tradableEquipment = allEquipment
    .filter((e) => !e.isEquipped)
    .map((e) => e.equipment);

  if (!tradableEquipment || tradableEquipment.length === 0) {
    await ctx.reply(
      `${SECTION_EMOJI} Тебе нечего трейдить, ниггер, че ты тут забыл?`
    );

    if (!isInitiator) {
      const trade = await TradeController.cancelTrade(accountId, tradeId!);
      await ctx.telegram.sendMessage(
        String(trade.initiatorId),
        `❌ ${trade.receiver.nickname} отменил трейд`
      );
    }
  }

  const replyMarkup =
    tradableEquipment.length > 1
      ? getTradeKeyboard(isInitiator, String(tradeId))
      : getTradeOneKeyboard(isInitiator, String(tradeId));

  const session = ctx.session as SessionData;
  session.pagination = {
    items: tradableEquipment,
    currentIndex: 0,
    type: "equipment",
    replyMarkup,
  };

  const { __dirname } = getESMPaths(import.meta.url);
  const imagePath = await getRandomImage(
    path.resolve(__dirname, "../../assets/images/EQUIPMENT"),
    path.resolve(__dirname, "../../assets/images/EQUIPMENT/1.jpg")
  );

  const first = tradableEquipment[0];

  if (isInitiator) {
    await ctx.deleteMessage();
  } else {
    await ctx.editMessageReplyMarkup(undefined);
  }

  await ctx.replyWithPhoto(
    { source: imagePath },
    {
      caption: formatPaginated(first, "equipment"),
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    }
  );
};

export const tradeValueMessage = (
  equipment?: UserEquipmentDto,
  racks?: number
): string => {
  if (equipment && racks) {
    return `<b>${equipment.equipment.brand} ${equipment.equipment.model}</b> и <b>${racks} Рэксов</b>`;
  } else if (equipment) {
    return `<b>${equipment.equipment.brand} ${equipment.equipment.model}</b>`;
  } else if (racks) {
    return `${racks} Рэксов`;
  } else {
    return "НИ-ХУ-Я";
  }
};
