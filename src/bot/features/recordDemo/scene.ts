import path from "path";
import { Scenes } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import {
  DemoController,
  UserController,
  UserEquipmentController,
} from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { getRandomImage } from "@utils/index";

export const recordDemoScene = new Scenes.BaseScene<MyContext>("recordDemo");

recordDemoScene.enter(async (ctx: MyContext) => {
  const session = ctx.session as SessionData;

  try {
    const { canRecord, remainingTimeText } = await DemoController.canRecord(
      ctx.user!.accountId
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
      return await ctx.scene.leave();
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
    session.demo!.name = msg.text.trim();

    const name = session.demo!.name;
    const text = session.demo!.text;

    try {
      const equipment = await UserEquipmentController.findEquipped(
        user!.accountId
      );
      const multiplier = equipment.reduce(
        (acc, item) => acc * item.equipment.multiplier,
        1
      );
      const imagePath = await getRandomImage(
        path.resolve(__dirname, `../../assets/images/DEMO`),
        path.resolve(__dirname, `../../assets/images/DEMO/1.jpg`)
      );
      await DemoController.create(user!.accountId, name, text);
      await UserController.addFame(user!.accountId, amount * multiplier);
      await ctx.replyWithPhoto(
        { source: imagePath },
        {
          caption: `🧖🏿 Демочка записана, ты получил +${
            amount * multiplier
          } фейма`,
        }
      );
    } catch (error) {
      userActionsLogger(
        "error",
        "recordDemoScene",
        `${(error as Error).message}`,
        { accountId: user!.accountId }
      );
      await ctx.reply("🚫 Произошла ошибка при сохранении демки");
      return await ctx.scene.leave();
    }

    delete session.demo;
    await ctx.scene.leave();
  }
});
