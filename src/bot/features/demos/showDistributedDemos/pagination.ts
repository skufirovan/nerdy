import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { DemoController } from "@controller";
import { paginate } from "../../pagination/action";
import { DISTRIBUTED_DEMOS_BUTTONS } from "./keyboard";
import { DistributedDemoWithDemoAndLikesDto } from "@domain/dtos";
import { formatDistributedDemo } from "../utils";
import { handleError } from "@utils/index";
import { refreshDemoFileIdIfNeeded } from "@utils/fileId";

export const paginateDistributedDemosActions = (bot: Telegraf<MyContext>) => {
  bot.action(DISTRIBUTED_DEMOS_BUTTONS.NEXT.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "NEXT");

      const currentItem = pagination.items[
        pagination.currentIndex
      ] as DistributedDemoWithDemoAndLikesDto;

      const newCaption = formatDistributedDemo(currentItem);

      const fileId = await refreshDemoFileIdIfNeeded({
        currentFileId: currentItem.demo.fileId!,
        channelId: process.env.DEMO_CHAT!,
        messageId: currentItem.demo.messageId!,
        telegram: ctx.telegram,
        onUpdate: async (newFileId, newMessageId) => {
          await DemoController.updateDemoInfo(
            ctx.user!.accountId,
            currentItem.demo.id,
            { fileId: newFileId, messageId: newMessageId }
          );
        },
      });

      await ctx.editMessageMedia(
        {
          type: "audio",
          media: fileId,
          caption: newCaption,
          parse_mode: "HTML",
        },
        { reply_markup: pagination.replyMarkup }
      );

      session.pagination = pagination;
    } catch (error) {
      handleError(ctx, error, "paginateDistributedDemosActions_next");
    }
  });

  bot.action(DISTRIBUTED_DEMOS_BUTTONS.PREV.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const session = ctx.session as SessionData;
      let pagination = session.pagination;

      if (!pagination) return;

      pagination = paginate(pagination, "PREV");

      const currentItem = pagination.items[
        pagination.currentIndex
      ] as DistributedDemoWithDemoAndLikesDto;

      const newCaption = formatDistributedDemo(currentItem);

      await ctx.editMessageMedia(
        {
          type: "audio",
          media: currentItem.demo.fileId!,
          caption: newCaption,
          parse_mode: "HTML",
        },
        { reply_markup: pagination.replyMarkup }
      );

      session.pagination = pagination;
    } catch (error) {
      handleError(ctx, error, "paginateDistributedDemosActions_prev");
    }
  });
};
