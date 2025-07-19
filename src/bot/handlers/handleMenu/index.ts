import path from "path";
import { MyContext } from "@bot/features/scenes";
import { menuKeyboard } from "./keyboard";
import { getRandomImage, handleError } from "@utils/index";

export const handleMenu = async (ctx: MyContext) => {
  try {
    return await ctx.replyWithPhoto(
      { source: path.resolve(__dirname, `../../assets/images/MENU/4.jpg`) },
      {
        caption: "",
        ...menuKeyboard,
      }
    );
  } catch (error) {
    await handleError(ctx, error, "handleProfile");
  }
};
