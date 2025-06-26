import { Markup } from "telegraf";
import { BUTTONS } from "../../bot/markup/buttons";

export const keyboards = {
  main: Markup.keyboard([[BUTTONS.MENU, BUTTONS.PROFILE]]).resize(),
};
