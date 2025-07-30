import { Markup, Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { SquadController } from "@controller/index";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const leaveSquadAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^LEAVE_SQUAD_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const adminId = ctx.match[1];

      await ctx.reply(`⚠️ Ты точно хочешь покинуть лейбл?`, {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✅ Подтвердить",
              `CONFIRM_LEAVE_SQUAD_${adminId}`
            ),
          ],
        ]).reply_markup,
      });
    } catch (error) {
      await handleError(ctx, error, "leaveSquadAction");
    }
  });

  bot.action(/^CONFIRM_LEAVE_SQUAD_(.+)$/, async (ctx) => {
    try {
      const accountId = ctx.user!.accountId;
      const adminId = BigInt(ctx.match[1]);

      const squad = await SquadController.findSquadByAdminId(
        accountId,
        adminId
      );

      if (!squad) return await ctx.answerCbQuery("❌ Объединение не найдено");

      await SquadController.deleteSquadMember(accountId, squad.name, accountId);

      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply(`${SECTION_EMOJI} Ну и правильно, нахуй эти лейблы`);
    } catch (error) {
      await handleError(ctx, error, "leaveSquadAction_confirm");
    }
  });
};
