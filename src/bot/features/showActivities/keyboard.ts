import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const ACTIVITIES_BUTTONS = {
  RECORD_DEMO: {
    text: "🎙 Записать демочку",
    callback: "ACTIVITIES_RECORD_DEMO",
  },
};

export const activitiesKeyboard = Markup.inlineKeyboard([
  [toButton(ACTIVITIES_BUTTONS.RECORD_DEMO)],
]);
