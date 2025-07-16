import { Markup } from "telegraf";
import { toButton } from "@utils/index";

export const CREATE_SQUAD_BUTTONS = {
  CREATE_SQUAD: {
    text: "👨🏿‍💼 Создать объединение",
    callback: "CREATE_SQUAD",
  },
};

export const createSquadKeyboard = Markup.inlineKeyboard([
  [toButton(CREATE_SQUAD_BUTTONS.CREATE_SQUAD)],
]);
