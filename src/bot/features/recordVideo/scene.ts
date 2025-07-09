import { Scenes } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { VideoController, DemoController, UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

const recordVideoScene = new Scenes.BaseScene<MyContext>("recordVideo");

recordVideoScene.enter(async (ctx: MyContext) => {
  const session = ctx.session as SessionData;

  try {
    const { canRecord, remainingTimeText } = await VideoController.canRecord(
      ctx.user!.accountId
    );
    if (!canRecord) {
      await ctx.reply(
        `☁️ Охлади траханье, приходи через ${remainingTimeText!}`
      );
      return await ctx.scene.leave();
    }

    session.video = {};
    await ctx.reply("📱 Напиши название демки, под которую снимешь ТТ");
  } catch (error) {
    userActionsLogger(
      "error",
      "recordVideoScene",
      `${(error as Error).message}`,
      {
        accountId: ctx.user!.accountId,
      }
    );
    await ctx.reply("🚫 Произошла ошибка, попробуй позже");
    await ctx.scene.leave();
  }
});

recordVideoScene.on(message("text"), async (ctx: MyContext) => {
  const session = ctx.session as SessionData;
  const user = ctx.user;
  const amount = 500;
  const msg = ctx.message as Message.TextMessage;

  if (!session.video!.demo) {
    const demo = await DemoController.findByName(
      user!.accountId,
      msg.text.trim()
    );

    if (demo) {
      session.video!.demo = demo;
      return await ctx.reply("💪🏿 Демочка выбрана, накидай описание для видоса");
    } else {
      return await ctx.reply("😣 Нема демки (( проверь название..");
    }
  }

  if (!session.video!.description) {
    session.video!.description = msg.text.trim();

    const demoId = session.video!.demo!.id;
    const description = session.video!.description;

    try {
      await VideoController.create(user!.accountId, demoId, description);
      await UserController.addFame(user!.accountId, amount);
      await ctx.reply(
        `🧖🏿 3к видосов под звуком и дропаю.. Ты получил +${amount} фейма`
      );
    } catch (error) {
      userActionsLogger(
        "error",
        "recordVideoScene",
        `${(error as Error).message}`,
        { accountId: user!.accountId }
      );
      await ctx.reply("🚫 Произошла ошибка при записи тиктока");
    }

    delete session.demo;
    await ctx.scene.leave();
  }
});

export default recordVideoScene;
