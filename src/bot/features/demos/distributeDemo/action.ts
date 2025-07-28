import path from "path";
import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import { DemoController, DistributedDemoController } from "@controller";
import { AUDIO_DEMOS_BUTTONS } from "../showAudioDemos/keyboard";
import { extractDemoNameFromCaption } from "../utils";
import { getRandomImage, handleError, hasCaption } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const distributeDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(AUDIO_DEMOS_BUTTONS.DISTRIBUTE_DEMO.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const canDistribute = await DemoController.canDistribute(
        ctx.user!.accountId
      );

      if (!canDistribute) {
        const imagePath = await getRandomImage(
          path.resolve(__dirname, `../../../assets/images/REMAINING`),
          path.resolve(__dirname, `../../../assets/images/REMAINING/1.jpg`)
        );
        return await ctx.replyWithPhoto(
          { source: imagePath },
          {
            caption: `${SECTION_EMOJI} Хоули щит, ниггер, ты уже закинул тречок на дистрибьюцию. Приходи после пятницы`,
          }
        );
      }

      const accountId = ctx.user!.accountId;
      const message = ctx.update.callback_query.message;
      const caption = hasCaption(message) ? message.caption : undefined;

      if (!caption) return await ctx.reply("❌ Не удалось определить демку");

      const name = extractDemoNameFromCaption(caption);
      if (!name) return await ctx.reply("❌ Название демки не найдено");

      const demo = await DemoController.findByName(accountId, name);

      if (!demo) return await ctx.reply("🙎🏿‍♂️ Нет такой демки у тебя, мазафакер");

      const existed = await DistributedDemoController.findByDemoId(
        accountId,
        demo.id
      );

      if (existed) return await ctx.reply("🙎🏿‍♂️ Эта демка уже на площадках");

      await DistributedDemoController.create(accountId, demo.id);

      await ctx.reply(
        `${SECTION_EMOJI} Демочка <b>${demo.name}</b> закинута на дистрибьюцию, дроп в пятницу`,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      await handleError(ctx, error, "distributeDemoAction");
    }
  });
};
