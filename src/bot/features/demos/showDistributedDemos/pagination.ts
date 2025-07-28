import { Telegraf } from "telegraf";
import { MyContext, SessionData } from "@bot/features/scenes";
import { paginate } from "../../pagination/action";
import { DISTRIBUTED_DEMOS_BUTTONS } from "./keyboard";
import { handleError } from "@utils/index";
import { DistributedDemoWithDemoAndLikesDto } from "@domain/dtos";
import { formatDistributedDemo } from "../utils";

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
