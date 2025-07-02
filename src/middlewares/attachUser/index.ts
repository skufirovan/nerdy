import { MyContext, SessionData } from "@bot/features/scenes";
import UserController from "@controller/UserController";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const attachUser = async (ctx: MyContext, next: () => Promise<void>) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = { accountId, username };

  if (!accountId) return ctx.reply("⚠️ Не удалось определить Telegram ID");

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
    return ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
};
