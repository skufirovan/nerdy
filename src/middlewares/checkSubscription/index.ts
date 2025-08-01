import { config } from "dotenv";
import { MiddlewareFn } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { userActionsLogger } from "@infrastructure/logger/userActionsLogger";

config();

const CHANNEL_LINK = process.env.CHANNEL_LINK!;
const CHANNEL_SHORT_LINK = CHANNEL_LINK.replace("https://t.me/", "@");

export const checkSubscription: MiddlewareFn<MyContext> = async (ctx, next) => {
  if (!ctx.user || !ctx.user.accountId) {
    return ctx.reply("⚠️ Не удалось определить Telegram ID");
  }

  const accountId = ctx.user.accountId;

  try {
    const member = await ctx.telegram.getChatMember(
      CHANNEL_SHORT_LINK,
      Number(accountId)
    );

    const allowedStatuses = ["member", "creator", "administrator"];
    if (!allowedStatuses.includes(member.status)) {
      return await ctx.reply(
        `📛 Чтобы продолжить, подпишись на [NERDY](${CHANNEL_LINK})`,
        {
          parse_mode: "Markdown",
          link_preview_options: {
            is_disabled: true,
          },
        }
      );
    }
    return next();
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    userActionsLogger(
      "error",
      "checkSubscription",
      `Ошибка при проверке подписки на канал: ${err}`,
      { accountId }
    );
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
};
