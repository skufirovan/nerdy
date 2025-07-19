import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { SquadController } from "@controller";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const inviteMemberActions = (bot: Telegraf<MyContext>) => {
  bot.action(/^INVITE_MEMBER_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      session.squadData = {
        requesterId: ctx.user!.accountId,
        name: ctx.match[1],
      };

      await ctx.scene.enter("inviteMember");
    } catch (error) {
      await handleError(ctx, error, "inviteMemberActions");
    }
  });

  bot.action(/^SQUAD_INVITE_ACCEPT_(.+)_(\d+)_(\d+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const squadName = ctx.match[1];
      const requesterId = BigInt(ctx.match[2]);
      const targetId = BigInt(ctx.match[3]);

      if (ctx.user!.accountId !== targetId)
        return await ctx.reply("❌ Недействительная кнопка");

      const member = await SquadController.addMember(
        requesterId,
        squadName,
        targetId
      );

      await ctx.editMessageText(`✅ Ты подписан на лейбл <b>${squadName}</b>`, {
        parse_mode: "HTML",
      });
      await ctx.telegram.sendMessage(
        String(requesterId),
        `${SECTION_EMOJI} Теперь <b>${member.user.nickname}</b> — новый подписант лейбла <b>${squadName}</b>`,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      await handleError(ctx, error, "inviteMemberActions_accept");
    }
  });
};
