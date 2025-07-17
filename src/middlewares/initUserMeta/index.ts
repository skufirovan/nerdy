import { MyContext } from "@bot/features/scenes";
import { UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const initUserMeta = async (
  ctx: MyContext,
  next: () => Promise<void>
) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  if (!accountId) return ctx.reply("⚠️ Не удалось определить Telegram ID");

  try {
    const user = await UserController.findByAccountId(accountId);

    if (user && user.username !== username) {
      await UserController.updateUserInfo(accountId, { username });
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    userActionsLogger("error", "initUserMeta", `${err}`, {
      accountId,
      username,
    });
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }

  ctx.user = { accountId, username };
  return next();
};
