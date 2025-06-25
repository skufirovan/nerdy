import { Scenes } from "telegraf";
import UserController from "@controller/UserController";
import { keyboards } from "@infrastructure/telegram/keyboards";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const handleStart = async (ctx: Scenes.SceneContext) => {
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
    let user = await UserController.getByAccountId(accountId);

    if (!user) {
      user = await UserController.register(accountId, username);
    }

    if (user.nickname) {
      return ctx.reply(`👋 Васап ${user?.nickname}`, keyboards.main);
    }

    return await ctx.scene.enter("chooseNickname", { accountId });
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
