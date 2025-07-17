import { session, Telegraf } from "telegraf";
import { config } from "dotenv";
import {
  attachUser,
  checkSubscription,
  initUserMeta,
} from "@middlewares/index";
import { MyContext, stage } from "@bot/features/scenes";
import { registerTelegramActions } from "@bot/features/actions";
import {
  handleStart,
  handleProfile,
  handleMenu,
  MAIN_BUTTONS,
} from "@bot/handlers";

config();

export const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);

bot.use(session());
bot.use(initUserMeta);
bot.use(stage.middleware());
bot.use(attachUser);
bot.use(checkSubscription);

bot.start(handleStart);

bot.hears(MAIN_BUTTONS.PROFILE, handleProfile);
bot.hears(MAIN_BUTTONS.MENU, handleMenu);

registerTelegramActions(bot);
