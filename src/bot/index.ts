import { Telegraf } from "telegraf";
import { config } from "dotenv";
import { registerTelegramActions } from "@infrastructure/telegram/actions";
import { BUTTONS } from "@infrastructure/telegram/buttons";
import { handleStart, handleProfile } from "./handlers";

config();

export const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(handleStart);

bot.hears(BUTTONS.PROFILE, handleProfile);

registerTelegramActions(bot);
