import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { SquadController } from "@controller";
import { TOP_BUTTONS } from "../keyboard";
import { topSquadsKeyboard } from "./keyboard";
import { formatSquad, handleError } from "@utils/index";

export const showTopSquadsAction = (bot: Telegraf<MyContext>) => {
  bot.action(TOP_BUTTONS.SQUAD_TOP.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const topSquads = await SquadController.findTopSquads(
        ctx.user!.accountId
      );

      const topSquadMembers = topSquads.map((s) => s.members);

      if (!topSquadMembers || topSquadMembers.length === 0)
        return await ctx.reply("👮🏿‍♂️ Все лейблы закрыты");

      const replyMarkup =
        topSquadMembers.length > 1 ? topSquadsKeyboard.reply_markup : undefined;

      const session = ctx.session as SessionData;
      session.pagination = {
        items: topSquadMembers,
        currentIndex: 0,
        type: "topSquad",
        replyMarkup,
      };

      const first = topSquadMembers[0];

      await ctx.replyWithPhoto(first[0].squad.photo, {
        caption: formatSquad(first),
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      });
    } catch (error) {
      await handleError(ctx, error, "showTopAction_squadTop");
    }
  });
};
