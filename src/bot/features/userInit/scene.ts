import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext } from "../scenes";
import { mainKeyboard } from "@bot/handlers/handleStart/keyboard";
import { UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { ValidationError, validate } from "@utils/index";

export const userInitScene = new Scenes.BaseScene<MyContext>("userInit");

userInitScene.enter(async (ctx: MyContext) => {
  await ctx.reply(
    "👨🏿‍🏫 Введи свой никнейм. У тебя только 1 попытка\n➖ Поспешишь – оппов насмешишь, подойди к этому с умом"
  );
});

userInitScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message)) {
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");
  }

  const accountId = ctx.user!.accountId;
  const username = ctx.user!.username;
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

  try {
    const existedNickname = await UserController.findByNickname(
      accountId,
      nickname
    );

    if (existedNickname) {
      return await ctx.reply(
        `❌ Оппы были быстрее и заняли этот ник, попробуй другой вариант`
      );
    }

    const existedUser = await UserController.findByAccountId(accountId);

    if (!existedUser) {
      await UserController.register(accountId, username, nickname);
    } else {
      await UserController.updateUserInfo(accountId, { nickname });
    }

    await ctx.reply(`☁️ Установлен ник <b>${nickname}</b>`, {
      parse_mode: "HTML",
      reply_markup: mainKeyboard.reply_markup,
    });
    await ctx.scene.leave();
  } catch (error) {
    userActionsLogger("error", "userInitScene", `${(error as Error).message}`, {
      accountId: ctx.user!.accountId,
    });
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
});
