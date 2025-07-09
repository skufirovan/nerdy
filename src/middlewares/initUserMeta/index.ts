import { MyContext, SessionData } from "@bot/features/scenes";

export const initUserMeta = async (
  ctx: MyContext,
  next: () => Promise<void>
) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  if (!accountId) return ctx.reply("⚠️ Не удалось определить Telegram ID");

  ctx.user = { accountId, username };
  return next();
};
