import { Markup } from "telegraf";

export const MAIN_BUTTONS = {
  MENU: "🎮 Меню",
  PROFILE: "👤 Профиль",
};

export const mainKeyboard = Markup.keyboard([
  [MAIN_BUTTONS.MENU, MAIN_BUTTONS.PROFILE],
]).resize();
