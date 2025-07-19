import { MiddlewareFn } from "telegraf";
import { MyContext } from "@bot/features/scenes";

export const initUserMeta: MiddlewareFn<MyContext> = async (ctx, next) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  if (!accountId) return ctx.reply("⚠️ Не удалось определить Telegram ID");

  ctx.user = { accountId, username };
  return next();
};
