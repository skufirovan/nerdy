import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "@bot/features/scenes";
import { requireUser, handleError } from "@utils/index";

export const addRacksToTradeScene = new Scenes.BaseScene<MyContext>(
  "addRacksToTrade"
);

addRacksToTradeScene.enter(async (ctx: MyContext) => {
  try {
    await ctx.reply("🪙 Введи количество рексов");
  } catch (error) {
    await handleError(ctx, error, "addRacksToTradeScene_enter");
    return ctx.scene.leave();
  }
});

addRacksToTradeScene.on(message("text"), async (ctx: MyContext) => {
  try {
    if (!ctx.message || !("text" in ctx.message))
      return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

    const input = Number(ctx.message.text.trim());
    const session = ctx.session as SessionData;
    const user = await requireUser(ctx);

    if (!user) return ctx.scene.leave();

    if (!Number.isInteger(input) || input <= 0 || input > user.racks) {
      await ctx.reply("🤚🏿 Введи число от 1 до " + user.racks);
      return ctx.scene.leave();
    }

    session.trade = {
      ...session.trade,
      racks: input,
    };

    await ctx.reply(`🪙 Ты добавил к трейду ${input} рэксов`);
    await ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "addRacksToTradeScene.on");
    return ctx.scene.leave();
  }
});
