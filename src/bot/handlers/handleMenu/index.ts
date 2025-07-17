import path from "path";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { MyContext } from "@bot/features/scenes";
import { menuKeyboard } from "./keyboard";

export const handleMenu = async (ctx: MyContext) => {
  const imagePath = path.resolve(__dirname, "../../assets/images/MENU.png");

  try {
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
