import path from "path";
import { MyContext } from "@bot/features/scenes";
import { UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { profileKeyboard } from "./keyboard";
import { formatDateToDDMMYYYY, getRandomImage } from "@utils/index";

export const handleProfile = async (ctx: MyContext) => {
  const accountId = ctx.user!.accountId;
  const username = ctx.user!.username;

  try {
    const user = await UserController.findByAccountId(accountId);
    const imagePath = await getRandomImage(
      path.resolve(__dirname, `../../assets/images/PROFILE`),
      path.resolve(__dirname, `../../assets/images/PROFILE/1.jpg`)
    );

    await ctx.replyWithPhoto(
      { source: imagePath },
      {
        caption: [
          `${user!.nickname}\n`,
          `Твой уровень: ${user!.level}`,
          `Фейм за все время: ${user!.fame}`,
          `Фейм за сезон: ${user!.seasonalFame}\n`,
          `☁️ Ты зарегистрировался ${formatDateToDDMMYYYY(user!.registeredAt)}`,
          `☁️ Статус пасса: ${user!.hasPass ? "активен" : "не активен"}`,
        ].join("\n"),
        ...profileKeyboard,
      }
    );
  } catch (error) {
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
    userActionsLogger(
      "error",
      "handleProfile",
      `Произошла ошибка при переходе в профиль: ${(error as Error).message}`,
      { accountId, username }
    );
  }
};
