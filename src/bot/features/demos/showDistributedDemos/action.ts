import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { MENU_BUTTONS } from "@bot/handlers";
import { handleError } from "@utils/index";
import { DistributedDemoController } from "@controller";
import {
  distributedDemosKeyboard,
  oneDistributedDemosKeyboard,
} from "./keyboard";
import { formatDistributedDemo } from "../utils";

export const showDistributedDemosAction = (bot: Telegraf<MyContext>) => {
  bot.action(MENU_BUTTONS.CHARTS.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const distributedDemos =
        await DistributedDemoController.getCurrentWeekDemos(
          ctx.user!.accountId
        );

      if (!distributedDemos || distributedDemos.length === 0)
        return await ctx.reply("🧖🏿 Чарты пустуют..");

      const replyMarkup =
        distributedDemos.length > 1
          ? distributedDemosKeyboard.reply_markup
          : oneDistributedDemosKeyboard.reply_markup;

      const session = ctx.session as SessionData;
      session.pagination = {
        items: distributedDemos,
        currentIndex: 0,
        type: "distributedDemos",
        replyMarkup,
      };

      const first = distributedDemos[0];

      await ctx.replyWithAudio(first.demo.fileId!, {
        caption: formatDistributedDemo(first),
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      });
    } catch (error) {
      handleError(ctx, error, "showDistributedDemosAction");
    }
  });
};
