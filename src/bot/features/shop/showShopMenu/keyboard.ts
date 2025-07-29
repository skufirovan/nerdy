import { toButton } from "@utils/index";
import { Markup } from "telegraf";

export const SHOP_BUTTONS = {
  EQUIPMENT: {
    text: "🎙 Оборудка",
    callback: "SHOP_EQUIPMENT",
  },
};

export const shopButtons = Markup.inlineKeyboard([
  [toButton(SHOP_BUTTONS.EQUIPMENT)],
]);
