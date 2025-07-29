import { Markup, Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { SquadController } from "@controller";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const deleteSquadAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^DELETE_SQUAD_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const adminId = BigInt(ctx.match[1]);

      await ctx.reply(`⚠️ Ты точно хочешь распустить лейбл?`, {
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✅ Подтвердить",
              `CONFIRM_DELETE_SQUAD_${adminId}`
            ),
          ],
        ]).reply_markup,
      });
    } catch (error) {
      await handleError(ctx, error, "deleteSquadAction");
    }
  });

  bot.action(/^CONFIRM_DELETE_SQUAD_(.+)$/, async (ctx) => {
    try {
      const accountId = ctx.user!.accountId;
      const adminId = BigInt(ctx.match[1]);

      const squad = await SquadController.findSquadByAdminId(
        accountId,
        adminId
      );

      if (!squad) return await ctx.answerCbQuery("❌ Объединение не найдено");

      await SquadController.deleteSquad(accountId, squad.name);

      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply(`${SECTION_EMOJI} Ну и правильно, нахуй эти лейблы`);
    } catch (error) {
      await handleError(ctx, error, "deleteSquadAction_confirm");
    }
  });
};
