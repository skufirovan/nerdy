import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "../scenes";
import { UserController } from "@controller";
import { mainKeyboard } from "@bot/handlers/handleStart/keyboard";
import { ValidationError, validate, handleError } from "@utils/index";

export const userInitScene = new Scenes.BaseScene<MyContext>("userInit");

userInitScene.enter(async (ctx: MyContext) => {
  try {
    const accountId = ctx.user!.accountId;
    const user = await UserController.findByAccountId(accountId);

    if (!user) {
      await ctx.reply(
        "👨🏿‍🏫 Введи свой никнейм. У тебя только 1 попытка\n➖ Поспешишь – оппов насмешишь, подойди к этому с умом"
      );
    }
  } catch (error) {
    await handleError(ctx, error, "userInitScene.enter");
    return ctx.scene.leave();
  }
});

userInitScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  try {
    const accountId = ctx.user!.accountId;
    const username = ctx.user!.username;

    const user = await UserController.findByAccountId(accountId);

    if (!user) {
      const nickname = ctx.message.text.trim();

      const validation = validate(nickname);

      if (!validation.isValid) {
        const errorMessages: Record<ValidationError, string> = {
          TOO_SHORT: "Ник короткий, прям как твой..",
          TOO_LONG: "Ник слишком длинный (максимум 40 символов)",
          INVALID_CHARS: "Можно использовать только буквы, цифры и _-.,!?",
        };

        return await ctx.reply(
          `⚠️ ${errorMessages[validation.error!]}\n➖ Давай заново`
        );
      }

      const existedNickname = await UserController.findByNickname(
        accountId,
        nickname
      );

      if (existedNickname) {
        return await ctx.reply(
          `❌ Оппы были быстрее и заняли этот ник, попробуй другой вариант`
        );
      }

      const session = ctx.session as SessionData;
      const referralId = session.referral ?? null;

      await UserController.register(accountId, username, nickname, referralId);

      await ctx.reply(`☁️ Установлен ник <b>${nickname}</b>`, {
        parse_mode: "HTML",
        reply_markup: mainKeyboard.reply_markup,
      });
    } else if (user.username !== username) {
      await UserController.updateUserInfo(accountId, { username });
    }

    return ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "userInitScene.on");
    return ctx.scene.leave();
  }
});
