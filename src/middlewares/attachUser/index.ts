import { MyContext, SessionData } from "@bot/features/scenes";
import { UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const attachUser = async (ctx: MyContext, next: () => Promise<void>) => {
  if (!ctx.user || !ctx.user.accountId) {
    return ctx.reply("⚠️ Не удалось определить Telegram ID");
  }

  const accountId = ctx.user.accountId;
  const username = ctx.user.username;
  const meta = { accountId, username };

  try {
    let user = await UserController.getByAccountId(accountId);
    const session = ctx.session as SessionData;

    if (!user) {
      if (!session.nickname) {
        return ctx.scene.enter("chooseNickname", { accountId });
      }
      user = await UserController.register(
        accountId,
        username,
        session.nickname
      );
      delete session.nickname;
    }

    ctx.user = user;
    return next();
  } catch (error) {
    userActionsLogger(
      "error",
      "attachUser",
      `${(error as Error).message}`,
      meta
    );
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
};
