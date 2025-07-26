import { Markup } from "telegraf";
import { DELETE_MESSAGE_BUTTON } from "@bot/features/deleteMessage/keyboard";
import { PAGINATE_BUTTONS } from "@bot/features/pagination/keyboard";
import { toButton } from "@utils/index";

export const showEquippedKeyboard = Markup.inlineKeyboard([
  [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
  [toButton(DELETE_MESSAGE_BUTTON.DELETE_MESSAGE)],
]);

export const showOneEquippedKeyboard = Markup.inlineKeyboard([
  [toButton(DELETE_MESSAGE_BUTTON.DELETE_MESSAGE)],
]);
