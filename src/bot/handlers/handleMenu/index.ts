import path from "path";
import { MyContext } from "@bot/features/scenes";
import { menuKeyboard } from "./keyboard";
import { handleError, getESMPaths } from "@utils/index";

export const handleMenu = async (ctx: MyContext) => {
  try {
    const { __dirname } = getESMPaths(import.meta.url);
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
