import path from "path";
import { Telegraf } from "telegraf";
import { MyContext } from "../../scenes";
import { DemoController } from "@controller";
import { ACTIVITIES_BUTTONS } from "../../showActivities/keyboard";
import { getRandomImage, handleError } from "@utils/index";

export const recordDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(ACTIVITIES_BUTTONS.RECORD_DEMO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const { canRecord, remainingTimeText } = await DemoController.canRecord(
        ctx.user!.accountId
      );

      if (!canRecord) {
        const imagePath = await getRandomImage(
          path.resolve(__dirname, `../../../assets/images/REMAINING`),
          path.resolve(__dirname, `../../../assets/images/REMAINING/1.jpg`)
        );
        return await ctx.replyWithPhoto(
          { source: imagePath },
          {
            caption: `☁️ Ты уже надристал стиля, брачо, приходи через ${remainingTimeText!}`,
          }
        );
      }

      await ctx.scene.enter("recordDemo");
    } catch (error) {
      await handleError(ctx, error, "recordDemoAction");
    }
  });
};
