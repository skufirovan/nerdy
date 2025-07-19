import { Markup, Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { SquadController } from "@controller";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const leaveSquadAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^LEAVE_SQUAD_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const squadName = ctx.match[1];

      await ctx.reply(
        `⚠️ Ты точно хочешь покинуть лейбл <b>${squadName}</b>?`,
        {
          parse_mode: "HTML",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.callback(
                "✅ Подтвердить",
                `CONFIRM_LEAVE_SQUAD_${squadName}`
              ),
            ],
          ]).reply_markup,
        }
      );
    } catch (error) {
      await handleError(ctx, error, "leaveSquadAction");
    }
  });

  bot.action(/^CONFIRM_LEAVE_SQUAD_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;
      const squadName = ctx.match[1];

      await SquadController.deleteSquadMember(accountId, squadName, accountId);

      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply(`${SECTION_EMOJI} Ну и правильно, нахуй эти лейблы`);
    } catch (error) {
      await handleError(ctx, error, "leaveSquadAction_confirm");
    }
  });
};
