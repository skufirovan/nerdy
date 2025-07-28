import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const DISTRIBUTED_DEMOS_BUTTONS = {
  PREV: { text: "⬅️", callback: "DISTRIBUTED_DEMOS_PREV" },
  NEXT: { text: "➡️", callback: "DISTRIBUTED_DEMOS_NEXT" },
  LIKE: { text: "❤️ Лайк", callback: "LIKE_DISTRIBUTED_DEMO" },
};

export const distributedDemosKeyboard = Markup.inlineKeyboard([
  [
    toButton(DISTRIBUTED_DEMOS_BUTTONS.PREV),
    toButton(DISTRIBUTED_DEMOS_BUTTONS.NEXT),
  ],
  [toButton(DISTRIBUTED_DEMOS_BUTTONS.LIKE)],
]);

export const oneDistributedDemosKeyboard = Markup.inlineKeyboard([
  [toButton(DISTRIBUTED_DEMOS_BUTTONS.LIKE)],
]);
