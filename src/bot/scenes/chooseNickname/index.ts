import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { keyboards } from "@bot/markup/keyboards";
import UserController from "@controller/UserController";
import { validateNickname } from "@utils/index";

const chooseNicknameScene = new Scenes.BaseScene<Scenes.SceneContext>(
  "chooseNickname"
);

chooseNicknameScene.enter((ctx) => {
  ctx.reply(
    "👨🏿‍🏫 Введи свой никнейм. У тебя только 1 попытка\n➖ Поспешишь – оппов насмешишь, подойди к этому с умом"
  );
});

chooseNicknameScene.on(message("text"), async (ctx) => {
  const nickname = ctx.message.text.trim();
  const accountId = (ctx.scene.state as { accountId: bigint }).accountId;

  const validation = validateNickname(nickname);
  if (!validation.isValid) {
    const errorMessages = {
      TOO_SHORT: "Ник короткий, прям как твой..",
      TOO_LONG: "Ник слишком длинный (максимум 40 символов)",
      CONTAINS_AT: "Никнейм не должен содержать символ @",
      EMOJI: "Никнейм не может содержать эмодзи",
      INVALID_CHARS: "Можно использовать только буквы, цифры и _-.,!?",
    };

    await ctx.reply(`⚠️ ${errorMessages[validation.error!]}\n➖ Давай заново`);
    return;
  }

  try {
    const existedUser = await UserController.getByNickname(nickname);

    if (existedUser) {
      await ctx.reply(
        `❌ Оппы были быстрее и заняли этот ник, попробуй другой вариант`
      );
      return;
    }

    await UserController.updateUserInfo(accountId, { nickname });

    await ctx.reply(`☁️ Теперь в ск на одного игрока больше`, keyboards.main);
    return ctx.scene.leave();
  } catch (error) {}
});

export default chooseNicknameScene;
