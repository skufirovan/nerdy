import { Markup } from "telegraf";

export const BUTTONS = {
  MENU: "🎮 Меню",
  PROFILE: "👤 Профиль",
};

export const CLOSE_BUTTON = Markup.button.callback(
  "✖️ Закрыть",
  "DELETE_MESSAGE"
);

export const MENU_BUTTONS = {
  TOP: { text: "🏆 Billboard", callback: "MENU_TOP" },
  ACTIVITIES: { text: "🎧 Темки", callback: "MENU_ACTIVITIES" },
  SHOP: { text: "🛍 Taobao", callback: "MENU_SHOP" },
  LABEL: { text: "👬 Лейбл", callback: "MENU_LABEL" },
  DONAT: { text: "🍩 Донат", callback: "MENU_DONAT" },
};

export const ACTIVITIES_BUTTONS = {
  RECORD_DEMO: {
    text: "🎙 Записать демочку",
    callback: "ACTIVITIES_RECORD_DEMO",
  },
};
