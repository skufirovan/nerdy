import { Telegraf } from "telegraf";
import { MyContext } from "./scenes";
import { registerDeleteMessageAction } from "./deleteMessage/action";
import { showActivitiesAction } from "./showActivities/action";
import { recordDemo } from "./recordDemo/action";

export const registerTelegramActions = (bot: Telegraf<MyContext>) => {
  registerDeleteMessageAction(bot);
  showActivitiesAction(bot);
  recordDemo(bot);
};
