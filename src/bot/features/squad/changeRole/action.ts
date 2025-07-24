import { Telegraf, Markup } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { toButton, handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const changeSquadMemberRoleAction = (bot: Telegraf<MyContext>) => {
  bot.action(/^PRE-CHANGE_ROLE_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const adminId = ctx.match[1];

      const PRE_CHANGE_ROLE_BUTTONS = {
        CHANGE_ROLE: {
          text: "👨🏿‍💼 Поменять роль",
          callback: `CHANGE_ROLE_${adminId}`,
        },
        INFO: {
          text: "ℹ️ Информация",
          callback: "PRE_CHANGE_ROLE_INFO",
        },
      };

      const preChangeRoleKeyboard = Markup.inlineKeyboard([
        [toButton(PRE_CHANGE_ROLE_BUTTONS.CHANGE_ROLE)],
        [toButton(PRE_CHANGE_ROLE_BUTTONS.INFO)],
      ]);

      await ctx.reply(
        `${SECTION_EMOJI} Если есть вопросы, загляни в раздел <b>Информация</b>`,
        {
          parse_mode: "HTML",
          reply_markup: preChangeRoleKeyboard.reply_markup,
        }
      );
    } catch (error) {
      await handleError(ctx, error, "changeSquadMemberRoleAction");
    }
  });

  bot.action(/^CHANGE_ROLE_(.+)$/, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      session.squadData = {
        requesterId: ctx.user!.accountId,
        adminId: BigInt(ctx.match[1]),
      };

      await ctx.scene.enter("changeSquadMemberRole");
    } catch (error) {
      await handleError(ctx, error, "changeSquadMemberRoleAction");
    }
  });

  bot.action("PRE_CHANGE_ROLE_INFO", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const text = [
        "👨🏿‍✈️ <b>CEO</b>",
        "➖ Доступна только владельцу лейбла",
        "➖ Полный контроль: может изменять настройки, назначать роли и передавать лейбл",
        "❗️ Если назначить другого игрока <b>CEO</b>, ты станешь <b>Подписантом</b>\n",
        "🕵🏿‍♂️ <b>A&R Менеджер</b>",
        "➖ Может приглашать новых участников в лейбл",
        "➖ Не имеет доступа к настройкам лейбла или передаче прав\n",
        "👨🏿‍🌾 <b>Подписант</b>",
        "➖ Роль по умолчанию для новых участников",
        "➖ Может выпускать музыку, но не управляет лейблом",
      ];

      await ctx.reply(text.join("\n"), { parse_mode: "HTML" });
    } catch (error) {
      await handleError(ctx, error, "changeSquadMemberRoleAction");
    }
  });
};
