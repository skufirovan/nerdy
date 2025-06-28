import { session, Telegraf } from "telegraf";
import { config } from "dotenv";
import { attachUser } from "@middlewares/index";
import { MyContext, stage } from "@bot/features/scenes";
import { registerTelegramActions } from "@bot/features/actions";
import { handleStart, handleProfile, handleMenu } from "@bot/handlers";
import { BUTTONS } from "@bot/markup/buttons";

config();

export const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);

bot.use(session());
bot.use(stage.middleware());
bot.use(attachUser);

bot.start(handleStart);

bot.hears(BUTTONS.PROFILE, handleProfile);
bot.hears(BUTTONS.MENU, handleMenu);

registerTelegramActions(bot);
