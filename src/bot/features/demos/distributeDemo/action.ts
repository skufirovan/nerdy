import path from "path";
import { Telegraf } from "telegraf";
import { MyContext } from "@bot/features/scenes";
import {
  DemoController,
  DistributedDemoController,
  UserController,
} from "@controller/index";
import { AUDIO_DEMOS_BUTTONS } from "../showAudioDemos/keyboard";
import { extractDemoNameFromCaption } from "../utils";
import {
  getRandomImage,
  handleError,
  hasCaption,
  getESMPaths,
} from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const distributeDemoAction = (bot: Telegraf<MyContext>) => {
  bot.action(AUDIO_DEMOS_BUTTONS.DISTRIBUTE_DEMO.callback, async (ctx) => {
    try {
      const canDistribute = await DemoController.canDistribute(
        ctx.user!.accountId
      );

      if (!canDistribute) {
        const { __dirname } = getESMPaths(import.meta.url);
        const imagePath = await getRandomImage(
          path.resolve(__dirname, `../../../assets/images/REMAINING`),
          path.resolve(__dirname, `../../../assets/images/REMAINING/1.jpg`)
        );

        await ctx.answerCbQuery();
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

      if (!caption)
        return await ctx.answerCbQuery("❌ Не удалось определить демку");

      const name = extractDemoNameFromCaption(caption);
      if (!name) return await ctx.answerCbQuery("❌ Название демки не найдено");

      const demo = await DemoController.findByName(accountId, name);

      if (!demo)
        return await ctx.answerCbQuery("🙎🏿‍♂️ Нет такой демки у тебя, мазафакер");

      const existed = await DistributedDemoController.findByDemoId(
        accountId,
        demo.id
      );

      if (existed) return await ctx.answerCbQuery("🙎🏿‍♂️ Эта демка уже отгружена");

      await DistributedDemoController.create(accountId, demo.id);
      await UserController.updateUserInfo(accountId, {
        lastDemoDistributedAt: new Date(),
      });

      await ctx.answerCbQuery();
      await ctx.reply(
        `${SECTION_EMOJI} Демочка <b>${demo.name}</b> закинута на дистрибьюцию, дроп в пятницу`,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      await handleError(ctx, error, "distributeDemoAction");
    }
  });
};
