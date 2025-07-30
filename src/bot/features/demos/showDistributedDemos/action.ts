import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { MENU_BUTTONS } from "@bot/handlers";
import { handleError } from "@utils/index";
import { DemoController, DistributedDemoController } from "@controller/index";
import {
  distributedDemosKeyboard,
  oneDistributedDemosKeyboard,
} from "./keyboard";
import { formatDistributedDemo } from "../utils";
import { refreshDemoFileIdIfNeeded } from "@utils/fileId";

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
      const fileId = await refreshDemoFileIdIfNeeded({
        currentFileId: first.demo.fileId!,
        channelId: process.env.DEMO_CHAT!,
        messageId: first.demo.messageId!,
        telegram: ctx.telegram,
        onUpdate: async (newFileId, newMessageId) => {
          await DemoController.updateDemoInfo(
            ctx.user!.accountId,
            first.demo.id,
            {
              fileId: newFileId,
              messageId: newMessageId,
            }
          );
        },
      });

      await ctx.replyWithAudio(fileId, {
        caption: formatDistributedDemo(first),
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      });
    } catch (error) {
      handleError(ctx, error, "showDistributedDemosAction");
    }
  });
};
