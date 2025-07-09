import { Markup } from "telegraf";
import { toButton } from "@utils/index";
import { PAGINATE_BUTTONS } from "../pagination/keyboard";

export const DEMOS_BUTTONS = {
  DELETE_DEMO: { text: "🗑 Удалить", callback: "DEMOS_DELETE_DEMO" },
};

export const demosKeyboard = Markup.inlineKeyboard([
  [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
  [toButton(DEMOS_BUTTONS.DELETE_DEMO)],
]);
