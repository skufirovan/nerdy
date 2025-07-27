import { Markup } from "telegraf";
import { toButton } from "@utils/index";
import { DELETE_DEMO_BUTTON } from "../deleteDemo/keyboard";

export const AUDIO_DEMOS_BUTTONS = {
  PREV: { text: "⬅️", callback: "AUDIO_DEMOS_PREV" },
  NEXT: { text: "➡️", callback: "AUDIO_DEMOS_NEXT" },
};

export const showAudioDemosKeyboard = Markup.inlineKeyboard([
  [toButton(AUDIO_DEMOS_BUTTONS.PREV), toButton(AUDIO_DEMOS_BUTTONS.NEXT)],
  [toButton(DELETE_DEMO_BUTTON.DELETE_DEMO)],
]);

export const showOneAudioDemosKeyboard = Markup.inlineKeyboard([
  [toButton(DELETE_DEMO_BUTTON.DELETE_DEMO)],
]);
