import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const PROFILE_BUTTONS = {
  DEMOS: { text: "💽 Дискография", callback: "PROFILE_DEMOS" },
  EQUIPMENT: { text: "🎙 Оборудка", callback: "PROFILE_EQUIPMENT" },
  CLOSE_BUTTON: { text: "✖️ Закрыть", callback: "DELETE_MESSAGE" },
};

export const profileKeyboard = Markup.inlineKeyboard([
  [toButton(PROFILE_BUTTONS.DEMOS)],
  [toButton(PROFILE_BUTTONS.EQUIPMENT)],
  [toButton(PROFILE_BUTTONS.CLOSE_BUTTON)],
]);
