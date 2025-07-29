import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const TOP_BUTTONS = {
  ALL_TIME_TOP: { text: "🏆 Зал славы", callback: "TOP_ALL_TIME_TOP" },
  SQUAD_TOP: { text: "🎖 Топ лейблов", callback: "TOP_SQUAD_TOP" },
};

export const topKeyboard = Markup.inlineKeyboard([
  [toButton(TOP_BUTTONS.ALL_TIME_TOP)],
  [toButton(TOP_BUTTONS.SQUAD_TOP)],
]);
