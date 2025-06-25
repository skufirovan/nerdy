import { Context } from "telegraf";
import UserController from "@controller/UserController";
import { keyboards } from "@infrastructure/telegram/keyboards";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const handleStart = async (ctx: Context) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = {
    accountId,
    username,
  };

  if (!accountId) {
    return ctx.reply("⚠️ Не удалось определить ваш Telegram ID");
  }

  try {
    await UserController.register(accountId, username);
    await ctx.reply(`👋 Восап хоуми`, keyboards.main);
  } catch (error) {
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");

    userActionsLogger(
      "error",
      "handleStart",
      `Произошла ошибка при выполнении /start: ${(error as Error).message}`,
      meta
    );
  }
};
