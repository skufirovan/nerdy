import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { keyboards } from "@infrastructure/telegram/keyboards";
import UserService from "@core/UserService";

const chooseNicknameScene = new Scenes.BaseScene<Scenes.SceneContext>(
  "chooseNickname"
);

chooseNicknameScene.enter((ctx) => {
  ctx.reply("🎤 Введи свой уникальный никнейм:");
});

chooseNicknameScene.on(message("text"), async (ctx) => {
  const nickname = ctx.message.text.trim();
  const accountId = (ctx.scene.state as { accountId: bigint }).accountId;

  await UserService.updateUserInfo(accountId, "nickname", nickname);

  await ctx.reply(`🔥 Теперь ты известен как ${nickname}`, keyboards.main);
  return ctx.scene.leave();
});

export default chooseNicknameScene;
