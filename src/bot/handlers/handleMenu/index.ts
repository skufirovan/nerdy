import path from "path";
import { MyContext } from "@bot/features/scenes";
import { menuKeyboard } from "./keyboard";
import { getRandomImage, handleError } from "@utils/index";

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
    await handleError(ctx, error, "handleProfile");
  }
};
