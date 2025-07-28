import { Markup } from "telegraf";
import { toButton } from "@utils/index";
import { DELETE_DEMO_BUTTON } from "../deleteDemo/keyboard";

export const AUDIO_DEMOS_BUTTONS = {
  PREV: { text: "⬅️", callback: "AUDIO_DEMOS_PREV" },
  NEXT: { text: "➡️", callback: "AUDIO_DEMOS_NEXT" },
  DISTRIBUTE_DEMO: { text: "💻 Дистрибьюция", callback: "DISTRIBUTE_DEMO" },
};

export const showAudioDemosKeyboard = Markup.inlineKeyboard([
  [toButton(AUDIO_DEMOS_BUTTONS.PREV), toButton(AUDIO_DEMOS_BUTTONS.NEXT)],
  [toButton(AUDIO_DEMOS_BUTTONS.DISTRIBUTE_DEMO)],
  [toButton(DELETE_DEMO_BUTTON.DELETE_DEMO)],
]);

export const showOneAudioDemosKeyboard = Markup.inlineKeyboard([
  [toButton(AUDIO_DEMOS_BUTTONS.DISTRIBUTE_DEMO)],
  [toButton(DELETE_DEMO_BUTTON.DELETE_DEMO)],
]);
