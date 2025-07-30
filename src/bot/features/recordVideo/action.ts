import path from "path";
import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { VideoController } from "@controller/index";
import { ACTIVITIES_BUTTONS } from "../showActivities/keyboard";
import { getRandomImage, handleError } from "@utils/index";

export const recordVideoAction = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.RECORD_VIDEO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const { canRecord, remainingTimeText } = await VideoController.canRecord(
        ctx.user!.accountId
      );

      if (!canRecord) {
        const imagePath = await getRandomImage(
          path.resolve(__dirname, `../../assets/images/REMAINING`),
          path.resolve(__dirname, `../../assets/images/REMAINING/1.jpg`)
        );
        return await ctx.replyWithPhoto(
          { source: imagePath },
          { caption: `☁️ Охлади траханье, приходи через ${remainingTimeText!}` }
        );
      }

      await ctx.scene.enter("recordVideo");
    } catch (error) {
      await handleError(ctx, error, "recordVideoAction");
    }
  });
};
