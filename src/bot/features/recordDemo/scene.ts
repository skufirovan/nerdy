import { Scenes } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { DemoController, UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

const recordDemoScene = new Scenes.BaseScene<MyContext>("recordDemo");

recordDemoScene.enter(async (ctx: MyContext) => {
  const session = ctx.session as SessionData;

  try {
    const { canRecord, remainingTimeText } = await DemoController.canRecord(
      ctx.user!.accountId
    );
    if (!canRecord) {
      await ctx.reply(
        `☁️ Ты уже надристал стиля, брачо, приходи через ${remainingTimeText!}`
      );
      return await ctx.scene.leave();
    }

    session.demo = {};
    await ctx.reply("📀 Фаа, сделал дело — рэпуй смело. Нука накидай баров");
  } catch (error) {
    userActionsLogger(
      "error",
      "recordDemoScene",
      `${(error as Error).message}`,
      { accountId: ctx.user!.accountId }
    );
    await ctx.reply("🚫 Произошла ошибка, попробуй позже");
    await ctx.scene.leave();
  }
});

recordDemoScene.on(message("text"), async (ctx: MyContext) => {
  const session = ctx.session as SessionData;
  const user = ctx.user;
  const amount = 500;
  const msg = ctx.message as Message.TextMessage;

  if (!session.demo!.text) {
    session.demo!.text = msg.text.trim();
    return await ctx.reply(
      "💪🏿 Базару нет, ты немощь. Придумай название демки, оно не должно повторяться!"
    );
  }

  if (!session.demo!.name) {
    session.demo!.name = msg.text.trim();

    const name = session.demo!.name;
    const text = session.demo!.text;

    try {
      await DemoController.create(user!.accountId, name, text);
      await UserController.addFame(user!.accountId, amount);
      await ctx.reply(`🧖🏿 Демочка записана, ты получил +${amount} фейма`);
    } catch (error) {
      userActionsLogger(
        "error",
        "recordDemoScene",
        `${(error as Error).message}`,
        { accountId: user!.accountId }
      );
      await ctx.reply("🚫 Произошла ошибка при сохранении демки.");
    }

    delete session.demo;
    await ctx.scene.leave();
  }
});

export default recordDemoScene;
