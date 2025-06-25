import { session, Telegraf } from "telegraf";
import { config } from "dotenv";
import { registerTelegramActions } from "@infrastructure/telegram/actions";
import { BUTTONS } from "@infrastructure/telegram/buttons";
import { handleStart, handleProfile } from "./handlers";
import { MyContext, stage } from "./scenes";

config();

export const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);

bot.use(session());
bot.use(stage.middleware());

bot.start(handleStart);

bot.hears(BUTTONS.PROFILE, handleProfile);

registerTelegramActions(bot);
