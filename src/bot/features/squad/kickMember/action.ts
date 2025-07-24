import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { handleError } from "@utils/index";

export const kickMemberAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^KICK_MEMBER_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      session.squadData = {
        requesterId: ctx.user!.accountId,
        adminId: BigInt(ctx.match[1]),
      };

      await ctx.scene.enter("kickMember");
    } catch (error) {
      await handleError(ctx, error, "kickMemberAction");
    }
  });
};
