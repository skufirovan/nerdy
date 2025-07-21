import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const MENU_BUTTONS = {
  TOP: { text: "🏆 Billboard", callback: "MENU_TOP" },
  ACTIVITIES: { text: "🎧 Темки", callback: "MENU_ACTIVITIES" },
  SHOP: { text: "🛍 Авито", callback: "MENU_SHOP" },
  SQUAD: { text: "👬 Лейбл", callback: "MENU_SQUAD" },
  DONAT: { text: "🍩 Донат", callback: "MENU_DONAT" },
};

export const menuKeyboard = Markup.inlineKeyboard([
  [toButton(MENU_BUTTONS.TOP)],
  [toButton(MENU_BUTTONS.ACTIVITIES)],
  [toButton(MENU_BUTTONS.SHOP)],
  [toButton(MENU_BUTTONS.SQUAD)],
  [toButton(MENU_BUTTONS.DONAT)],
]);
