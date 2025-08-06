import { PAGINATE_BUTTONS } from "@bot/features/pagination/keyboard";
import { toButton } from "@utils/index";
import { Markup } from "telegraf";

export const TRADE_BUTTONS = {
  CHOOSE_EQUIPMENT: {
    text: "👨🏿‍🔧 Выбрать",
    callback: "TRADE_CHOOSE_EQUIPMENT",
  },
  ADD_RACKS: {
    text: "🪙 Добавить рэксы",
    callback: "TRADE_ADD_RACKS",
  },
  INITIATE: {
    text: "✅ Отправить",
    callback: "TRADE_INITIATE",
  },
};

export const getTradeKeyboard = (isInitiator: boolean, tradeId?: string) =>
  Markup.inlineKeyboard([
    [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
    [toButton(TRADE_BUTTONS.CHOOSE_EQUIPMENT)],
    [toButton(TRADE_BUTTONS.ADD_RACKS)],
    [
      toButton(
        isInitiator
          ? TRADE_BUTTONS.INITIATE
          : {
              text: "✅ Отправить",
              callback: `TRADE_RESPOND_${tradeId}`,
            }
      ),
    ],
  ]).reply_markup;

export const getTradeOneKeyboard = (isInitiator: boolean, tradeId?: string) =>
  Markup.inlineKeyboard([
    [toButton(TRADE_BUTTONS.CHOOSE_EQUIPMENT)],
    [toButton(TRADE_BUTTONS.ADD_RACKS)],
    [
      toButton(
        isInitiator
          ? TRADE_BUTTONS.INITIATE
          : {
              text: "✅ Отправить",
              callback: `TRADE_RESPOND_${tradeId}`,
            }
      ),
    ],
  ]).reply_markup;
