import { toButton } from "@utils/index";
import { Markup } from "telegraf";

export const SHOW_DEMOS_BUTTONS = {
  TEXT_DEMOS: { text: "📝 Текстовые демки", callback: "SHOW_TEXT_DEMOS" },
  AUDIO_DEMOS: { text: "🗣 Аудио демки", callback: "SHOW_AUDIO_DEMOS" },
};

export const showDemosKeyboard = Markup.inlineKeyboard([
  [toButton(SHOW_DEMOS_BUTTONS.TEXT_DEMOS)],
  [toButton(SHOW_DEMOS_BUTTONS.AUDIO_DEMOS)],
]);
