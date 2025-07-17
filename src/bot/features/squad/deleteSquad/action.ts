import { Markup, Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { SquadController } from "@controller";
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
      userActionsLogger(
        "error",
        "deleteSquadAction_confirm",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось выполнить действие. Попробуй позже.");
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
      userActionsLogger(
        "error",
        "deleteSquadAction",
        `${(error as Error).message}`,
        { accountId: ctx.user!.accountId }
      );
      await ctx.reply("❌ Не удалось выполнить действие. Попробуй позже.");
    }
  });
};
