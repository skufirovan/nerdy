import path from "path";
import { MyContext } from "@bot/features/scenes";
import { UserController } from "@controller/index";
import { profileKeyboard } from "./keyboard";
import {
  formatDateToDDMMYYYY,
  getRandomImage,
  handleError,
  getESMPaths,
} from "@utils/index";

export const handleProfile = async (ctx: MyContext) => {
  const accountId = ctx.user!.accountId;

  try {
    const user = await UserController.findByAccountId(accountId);
    const { __dirname } = getESMPaths(import.meta.url);
    const imagePath = await getRandomImage(
      path.resolve(__dirname, `../../assets/images/PROFILE`),
      path.resolve(__dirname, `../../assets/images/PROFILE/1.jpg`)
    );

    await ctx.replyWithPhoto(
      { source: imagePath },
      {
        parse_mode: "HTML",
        caption: [
          `<b>${user!.nickname}</b>\n`,
          `🪙 Уровень сваги: ${user!.level}`,
          `🪙 Рэксы: ${user!.racks}\n`,
          `🧌 Фейм за все время: ${user!.fame}`,
          `🧌 Фейм за сезон: ${user!.seasonalFame}\n`,
          `☁️ В статусе игрока с ${formatDateToDDMMYYYY(user!.registeredAt)}`,
          `☁️ Статус пасса: ${user!.hasPass ? "активен" : "не активен"}`,
        ].join("\n"),
        ...profileKeyboard,
      }
    );
  } catch (error) {
    await handleError(ctx, error, "handleProfile");
  }
};
