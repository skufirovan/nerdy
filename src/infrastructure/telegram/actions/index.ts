import { Telegraf } from "telegraf";
import { registerDeleteMessageAction } from "./deleteMessage";

export const registerTelegramActions = (bot: Telegraf) => {
  registerDeleteMessageAction(bot);
};
