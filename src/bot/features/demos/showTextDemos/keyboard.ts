import { Markup } from "telegraf";
import { toButton } from "@utils/index";
import { PAGINATE_BUTTONS } from "../../pagination/keyboard";
import { DELETE_DEMO_BUTTON } from "../deleteDemo/keyboard";

export const paginateDemosKeyboard = Markup.inlineKeyboard([
  [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
  [toButton(DELETE_DEMO_BUTTON.DELETE_DEMO)],
]);
