import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const PAGINATE_BUTTONS = {
  PREV: { text: "⬅️", callback: "PAGINATE_PREV" },
  NEXT: { text: "➡️", callback: "PAGINATE_NEXT" },
};

export const paginationKeyboard = Markup.inlineKeyboard([
  [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
]);
