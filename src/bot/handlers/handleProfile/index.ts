import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { MyContext } from "@bot/features/scenes";
import { keyboards } from "@bot/markup/keyboards";
import { formatDateToDDMMYYYY } from "@utils/index";

export const handleProfile = async (ctx: MyContext) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = { accountId, username };

  try {
    const user = ctx.user;

    await ctx.reply(
      [
        `${user!.nickname ?? "игрок"}\n`,
        `Твой уровень: ${user!.level}`,
        `Фейм за все время: ${user!.fame}`,
        `Фейм за сезон: ${user!.seasonalFame}\n`,
        `☁️ Ты зарегистрировался ${formatDateToDDMMYYYY(user!.registeredAt)}`,
        `☁️ Статус пасса: ${user!.hasPass ? "активен" : "не активен"}`,
      ].join("\n"),
      keyboards.profile
    );

    userActionsLogger(
      "info",
      "handleProfile",
      "Пользователь перешел в профиль",
      meta
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
