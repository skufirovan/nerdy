import path from "path";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { MyContext } from "@bot/features/scenes";
import { menuKeyboard } from "./keyboard";

export const handleMenu = async (ctx: MyContext) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = { accountId, username };
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
      meta
    );
  }
};
