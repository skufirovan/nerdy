import { Markup } from "telegraf";
import {
  ACTIVITIES_BUTTONS,
  BUTTONS,
  CLOSE_BUTTON,
  PAGINATE_BUTTONS,
  MENU_BUTTONS,
  PROFILE_BUTTONS,
  DEMOS_BUTTONS,
  CONFIRM_BUTTONS,
} from "./buttons";

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
  profile: Markup.inlineKeyboard([
    [toButton(PROFILE_BUTTONS.DEMOS)],
    [CLOSE_BUTTON],
  ]),
  demos: Markup.inlineKeyboard([
    [toButton(PAGINATE_BUTTONS.PREV), toButton(PAGINATE_BUTTONS.NEXT)],
    [toButton(DEMOS_BUTTONS.DELETE_DEMO)],
  ]),
  activities: Markup.inlineKeyboard([
    [toButton(ACTIVITIES_BUTTONS.RECORD_DEMO)],
  ]),
  confirm: Markup.inlineKeyboard([
    toButton(CONFIRM_BUTTONS.CONFIRM),
    toButton(CONFIRM_BUTTONS.CANCEL),
  ]),
};
