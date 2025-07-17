import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { SquadController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
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
      userActionsLogger(
        "error",
        "inviteMemberAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось выполнить действие. Попробуй позже.");
    }
  });

  bot.action(/^SQUAD_INVITE_ACCEPT_(.+)_(\d+)_(\d+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const squadName = ctx.match[1];
      const requesterId = BigInt(ctx.match[2]);
      const targetId = BigInt(ctx.match[3]);

      if (ctx.user!.accountId !== targetId) {
        await ctx.reply("❌ Недействительная кнопка");
        return;
      }

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
      userActionsLogger(
        "error",
        "inviteMemberAction_accept",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось выполнить действие. Попробуй позже.");
    }
  });

  bot.action("SQUAD_INVITE_DECLINE", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.editMessageText("❌ Ты отклонил приглашение");
    } catch (error) {
      userActionsLogger(
        "error",
        "inviteMemberAction_decline",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось выполнить действие. Попробуй позже.");
    }
  });
};
