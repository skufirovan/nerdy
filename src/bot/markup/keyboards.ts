import { Markup } from "telegraf";
import { ACTIVITIES_BUTTONS, BUTTONS, MENU_BUTTONS } from "./buttons";

type Button = {
  text: string;
  callback: string;
};

const toButton = ({ text, callback }: Button) =>
  Markup.button.callback(text, callback);

export const keyboards = {
  main: Markup.keyboard([[BUTTONS.MENU, BUTTONS.PROFILE]]).resize(),
  menu: Markup.inlineKeyboard([
    [toButton(MENU_BUTTONS.TOP)],
    [toButton(MENU_BUTTONS.ACTIVITIES)],
    [toButton(MENU_BUTTONS.SHOP)],
    [toButton(MENU_BUTTONS.LABEL)],
    [toButton(MENU_BUTTONS.DONAT)],
  ]),
  activities: Markup.inlineKeyboard([
    [toButton(ACTIVITIES_BUTTONS.RECORD_DEMO)],
  ]),
};
