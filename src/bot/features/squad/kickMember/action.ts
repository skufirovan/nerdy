import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const kickMemberAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^KICK_MEMBER_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const session = ctx.session as SessionData;
      session.squadData = {
        requesterId: ctx.user!.accountId,
        name: ctx.match[1],
      };
      await ctx.scene.enter("kickMember");
    } catch (error) {
      userActionsLogger(
        "error",
        "kickMemberAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось выполнить действие. Попробуй позже.");
    }
  });
};
