import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const ACTIVITIES_BUTTONS = {
  RECORD_DEMO: {
    text: "🎙 Записать демочку",
    callback: "ACTIVITIES_RECORD_DEMO",
  },
  RECORD_VIDEO: { text: "🤳🏿 Снять ТТ", callback: "ACTIVITIES_RECORD_TT" },
  BATTLE: { text: "⚔️ Версус", callback: "ACTIVITIES_BATTLE" },
  SAPPER: { text: "🎰 Лудка", callback: "ACTIVITIES_SAPPER" },
};

export const activitiesKeyboard = Markup.inlineKeyboard([
  [toButton(ACTIVITIES_BUTTONS.RECORD_DEMO)],
  [toButton(ACTIVITIES_BUTTONS.RECORD_VIDEO)],
  [toButton(ACTIVITIES_BUTTONS.BATTLE)],
  [toButton(ACTIVITIES_BUTTONS.SAPPER)],
]);
