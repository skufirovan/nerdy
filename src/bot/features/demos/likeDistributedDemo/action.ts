import { MyContext } from "@bot/features/scenes";
import { Telegraf } from "telegraf";
import { DISTRIBUTED_DEMOS_BUTTONS } from "../showDistributedDemos/keyboard";
import { handleError, hasCaption } from "@utils/index";
import { extractNameAndNicknameFromCaption } from "../utils";
import { DistributedDemoController } from "@controller/index";

export const likeDistributedDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(DISTRIBUTED_DEMOS_BUTTONS.LIKE.callback, async (ctx) => {
    try {
      const accountId = ctx.user!.accountId;
      const message = ctx.update.callback_query.message;

      if (!message || !hasCaption(message) || !("reply_markup" in message))
        return await ctx.answerCbQuery("❌ Не удалось определить трек");

      const caption = message.caption;
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

      const likesMatch = caption.match(/❤️ (\d+)/);
      const currentLikes = likesMatch ? parseInt(likesMatch[1], 10) : 0;
      const newLikes = isLiked ? currentLikes + 1 : currentLikes - 1;

      const newCaption = caption.replace(/❤️ \d+/, `❤️ ${newLikes}`);

      await ctx.editMessageCaption(newCaption, {
        parse_mode: "HTML",
        reply_markup: message.reply_markup,
      });

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
