import { Markup } from "telegraf";

export const BUTTONS = {
  MENU: "🎮 Меню",
  PROFILE: "👤 Профиль",
};

export const CLOSE_BUTTON = Markup.button.callback(
  "✖️ Закрыть",
  "DELETE_MESSAGE"
);

export const CONFIRM_BUTTONS = {
  CONFIRM: { text: "✅ Да", callback: "CONFIRM_CONFIRM" },
  CANCEL: { text: "❌ Нет", callback: "CONFIRM_CANCEL" },
};

export const MENU_BUTTONS = {
  TOP: { text: "🏆 Billboard", callback: "MENU_TOP" },
  ACTIVITIES: { text: "🎧 Темки", callback: "MENU_ACTIVITIES" },
  SHOP: { text: "🛍 Taobao", callback: "MENU_SHOP" },
  LABEL: { text: "👬 Лейбл", callback: "MENU_LABEL" },
  DONAT: { text: "🍩 Донат", callback: "MENU_DONAT" },
};

export const PROFILE_BUTTONS = {
  DEMOS: { text: "💽 Дискография", callback: "PROFILE_DEMOS" },
  EQUIPMENT: { text: "🎙 Оборудка", callback: "PROFILE_EQUIPMENT" },
};

export const DEMOS_BUTTONS = {
  DELETE_DEMO: { text: "🗑 Удалить", callback: "DEMOS_DELETE_DEMO" },
};

export const PAGINATE_BUTTONS = {
  PREV: { text: "⬅️", callback: "PAGINATE_PREV" },
  NEXT: { text: "➡️", callback: "PAGINATE_NEXT" },
};

export const ACTIVITIES_BUTTONS = {
  RECORD_DEMO: {
    text: "🎙 Записать демочку",
    callback: "ACTIVITIES_RECORD_DEMO",
  },
};
