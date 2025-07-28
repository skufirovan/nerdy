import { MyContext } from "@bot/features/scenes";
import { Telegraf } from "telegraf";
import { DISTRIBUTED_DEMOS_BUTTONS } from "../showDistributedDemos/keyboard";
import { handleError, hasCaption } from "@utils/index";
import { extractNameAndNicknameFromCaption } from "../utils";
import { DistributedDemoController } from "@controller";

export const likeDistributedDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(DISTRIBUTED_DEMOS_BUTTONS.LIKE.callback, async (ctx) => {
    try {
      const accountId = ctx.user!.accountId;
      const message = ctx.update.callback_query.message;
      const caption = hasCaption(message) ? message.caption : undefined;

      if (!caption)
        return await ctx.answerCbQuery("❌ Не удалось определить трек");

      const { name, nickname } = extractNameAndNicknameFromCaption(caption);

      if (!name || !nickname)
        return await ctx.answerCbQuery("❌ Не удалось определить трек");

      const distributedDemo =
        await DistributedDemoController.findByNameAndNickname(
          accountId,
          name,
          nickname
        );

      if (!distributedDemo)
        return await ctx.answerCbQuery("❌ Не удалось определить трек");

      const isLiked = await DistributedDemoController.toggleLike(
        accountId,
        distributedDemo.id
      );

      if (isLiked) {
        await ctx.answerCbQuery("❤️ Ты поставил лайк");
      } else {
        await ctx.answerCbQuery("💔 Ты убрал лайк");
      }
    } catch (error) {
      handleError(ctx, error, "likeDistributedDemoAction");
    }
  });
};
