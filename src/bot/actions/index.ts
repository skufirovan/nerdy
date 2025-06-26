import { Telegraf } from "telegraf";
import { MyContext } from "@bot/scenes";
import { registerDeleteMessageAction } from "./deleteMessage";

export const registerTelegramActions = (bot: Telegraf<MyContext>) => {
  registerDeleteMessageAction(bot);
};
