import path from "path";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { MyContext } from "@bot/features/scenes";
import { menuKeyboard } from "./keyboard";
import { getRandomImage } from "@utils/index";

export const handleMenu = async (ctx: MyContext) => {
  try {
    const imagePath = await getRandomImage(
      path.resolve(__dirname, `../../assets/images/MENU`),
      path.resolve(__dirname, `../../assets/images/MENU/1.jpg`)
    );

    return await ctx.replyWithPhoto(
      { source: imagePath },
      {
        caption: "",
        ...menuKeyboard,
      }
    );
  } catch (error) {
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");

    userActionsLogger(
      "error",
      "handleProfile",
      `Произошла ошибка при переходе в профиль: ${(error as Error).message}`,
      { accountId: ctx.user!.accountId, username: ctx.user!.username }
    );
  }
};
