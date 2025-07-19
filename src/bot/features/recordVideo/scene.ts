import path from "path";
import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { VideoController, DemoController, UserController } from "@controller";
import { getRandomImage, handleError } from "@utils/index";

export const recordVideoScene = new Scenes.BaseScene<MyContext>("recordVideo");

recordVideoScene.enter(async (ctx: MyContext) => {
  try {
    const accountId = ctx.user!.accountId;
    const session = ctx.session as SessionData;

    const { canRecord, remainingTimeText } = await VideoController.canRecord(
      accountId
    );

    if (!canRecord) {
      const imagePath = await getRandomImage(
        path.resolve(__dirname, `../../assets/images/REMAINING`),
        path.resolve(__dirname, `../../assets/images/REMAINING/1.jpg`)
      );
      await ctx.replyWithPhoto(
        { source: imagePath },
        { caption: `☁️ Охлади траханье, приходи через ${remainingTimeText!}` }
      );
      return ctx.scene.leave();
    }

    session.video = {};
    await ctx.reply("📱 Напиши название демки, под которую снимешь ТТ");
  } catch (error) {
    await handleError(ctx, error, "recordVideoScene.enter");
    return ctx.scene.leave();
  }
});

recordVideoScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const amount = 500;
  const msg = ctx.message.text.trim();

  try {
    if (!session.video!.demo) {
      const demo = await DemoController.findByName(accountId, msg);

      if (demo) {
        session.video!.demo = demo;
        return await ctx.reply(
          "💪🏿 Демочка выбрана, накидай описание для видоса"
        );
      } else {
        await ctx.reply("😣 Нема демки (( проверь название..");
        return ctx.scene.leave();
      }
    }

    if (!session.video!.description) {
      session.video!.description = msg;
      const demoId = session.video!.demo!.id;
      const description = session.video!.description;

      await VideoController.create(accountId, demoId, description);
      await UserController.addFame(accountId, amount);

      await ctx.replyWithAnimation(
        { source: path.resolve(__dirname, `../../assets/images/VIDEO/1.gif`) },
        {
          caption: `🧖🏿 3к видосов под звуком и дропаю.. Ты получил +${amount} фейма`,
        }
      );
      delete session.video;
      await ctx.scene.leave();
    }
  } catch (error) {
    await handleError(ctx, error, "recordVideoScene.enter");
    return ctx.scene.leave();
  }
});
