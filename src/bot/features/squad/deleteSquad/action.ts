import { Markup, Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { SquadController } from "@controller";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const deleteSquadAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^DELETE_SQUAD_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const squadName = ctx.match[1];

      await ctx.reply(
        `⚠️ Ты точно хочешь распустить лейбл <b>${squadName}</b>?`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.callback(
                "✅ Подтвердить",
                `CONFIRM_DELETE_SQUAD_${squadName}`
              ),
            ],
          ]).reply_markup,
        }
      );
    } catch (error) {
      await handleError(ctx, error, "deleteSquadAction");
    }
  });

  bot.action(/^CONFIRM_DELETE_SQUAD_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;
      const squadName = ctx.match[1];

      await SquadController.deleteSquad(accountId, squadName);

      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply(`${SECTION_EMOJI} Ну и правильно, нахуй эти лейблы`);
    } catch (error) {
      await handleError(ctx, error, "deleteSquadAction_confirm");
    }
  });
};
