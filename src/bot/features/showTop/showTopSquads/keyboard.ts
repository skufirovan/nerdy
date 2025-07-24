import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const TOP_SQUADS_BUTTON = {
  PREV: { text: "⬅️", callback: "TOP_SQUADS_PREV" },
  NEXT: { text: "➡️", callback: "TOP_SQUADS_NEXT" },
  CLOSE_TOP: { text: "🗑 Закрыть", callback: "DELETE_MESSAGE" },
};

export const topSquadsKeyboard = Markup.inlineKeyboard([
  [toButton(TOP_SQUADS_BUTTON.PREV), toButton(TOP_SQUADS_BUTTON.NEXT)],
  [toButton(TOP_SQUADS_BUTTON.CLOSE_TOP)],
]);
