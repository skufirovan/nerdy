import path from "path";
import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import {
  DemoController,
  UserController,
  UserEquipmentController,
} from "@controller";
import { getRandomImage, handleError } from "@utils/index";

export const recordDemoScene = new Scenes.BaseScene<MyContext>("recordDemo");

recordDemoScene.enter(async (ctx: MyContext) => {
  try {
    const accountId = ctx.user!.accountId;
    const session = ctx.session as SessionData;

    const { canRecord, remainingTimeText } = await DemoController.canRecord(
      accountId
    );

    if (!canRecord) {
      const imagePath = await getRandomImage(
        path.resolve(__dirname, `../../assets/images/REMAINING`),
        path.resolve(__dirname, `../../assets/images/REMAINING/1.jpg`)
      );
      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: `☁️ Ты уже надристал стиля, брачо, приходи через ${remainingTimeText!}`,
        }
      );
      return ctx.scene.leave();
    }

    session.demo = {};
    const firstVideoPath = path.resolve(
      __dirname,
      "../../assets/videos/DEMO_1.gif"
    );

    await ctx.replyWithAnimation(
      { source: firstVideoPath },
      { caption: "📀 Фаа, сделал дело — рэпуй смело. Ну-ка накидай баров" }
    );
  } catch (error) {
    await handleError(ctx, error, "recordDemoScene.enter");
    return ctx.scene.leave();
  }
});

recordDemoScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const amount = 500;
  const msg = ctx.message.text.trim();

  try {
    if (!session.demo!.text) {
      session.demo!.text = msg;
      const secondVideoPath = path.resolve(
        __dirname,
        "../../assets/videos/DEMO_2.gif"
      );

      return await ctx.replyWithAnimation(
        { source: secondVideoPath },
        {
          caption:
            "💪🏿 Базару нет, ты немощь. Придумай название демки, оно не должно повторяться!",
        }
      );
    }

    if (!session.demo!.name) {
      session.demo!.name = msg;

      const name = session.demo!.name;
      const text = session.demo!.text;

      const equipment = await UserEquipmentController.findEquipped(accountId);
      const multiplier = equipment.reduce(
        (acc, item) => acc * item.equipment.multiplier,
        1
      );
      const imagePath = await getRandomImage(
        path.resolve(__dirname, `../../assets/images/DEMO`),
        path.resolve(__dirname, `../../assets/images/DEMO/1.jpg`)
      );

      await DemoController.create(accountId, name, text);
      await UserController.addFame(accountId, amount * multiplier);

      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: `🧖🏿 Демочка записана, ты получил +${
            amount * multiplier
          } фейма`,
        }
      );
    }
    delete session.demo;
    return ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "recordDemoScene.on");
    return ctx.scene.leave();
  }
});
