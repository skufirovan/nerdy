import { Scenes } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import DemoController from "@controller/DemoController";

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
      return ctx.scene.leave();
    }

    session.demo = {};
    await ctx.reply("📀 Фаа, сделал дело — рэпуй смело. Нука накидай баров");
  } catch (error) {
    await ctx.reply("🚫 Произошла ошибка, попробуй позже");
    return ctx.scene.leave();
  }
});

recordDemoScene.on(message("text"), async (ctx: MyContext) => {
  const session = ctx.session as SessionData;
  const msg = ctx.message as Message.TextMessage;

  if (!session.demo!.text) {
    session.demo!.text = msg.text.trim();
    return await ctx.reply("💪🏿 Базару нет, ты немощь. Придумай название демки");
  }

  if (!session.demo!.name) {
    session.demo!.name = msg.text.trim();

    const name = session.demo!.name;
    const text = session.demo!.text;
    const accountId = BigInt(ctx.from!.id);

    try {
      await DemoController.create(accountId, name, text);

      await ctx.reply("🧖🏿 Демочка записана, можешь скидывать ей");
    } catch (err) {
      await ctx.reply("🚫 Произошла ошибка при сохранении демки.");
    }

    delete session.demo;
    return ctx.scene.leave();
  }
});

export default recordDemoScene;
