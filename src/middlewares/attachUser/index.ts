import { MyContext } from "@bot/scenes";
import UserController from "@controller/UserController";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const attachUser = async (ctx: MyContext, next: () => Promise<void>) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = { accountId, username };

  if (!accountId) return ctx.reply("⚠️ Не удалось определить Telegram ID");

  try {
    let user = await UserController.getByAccountId(accountId);

    if (!user) {
      user = await UserController.register(accountId, username);
    }

    ctx.user = user;
    return next();
  } catch (error) {
    userActionsLogger(
      "error",
      "attachUser",
      `Ошибка в attachUser: ${(error as Error).message}`,
      meta
    );
    return ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
};
