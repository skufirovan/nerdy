import { Markup } from "telegraf";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { MyContext } from "@bot/scenes";
import { BUTTONS } from "@bot/markup/buttons";
import { formatDateToDDMMYYYY } from "@utils/index";

export const handleProfile = async (ctx: MyContext) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = { accountId, username };

  try {
    const user = ctx.user;

    await ctx.reply(
      [
        `${user.nickname ?? "игрок"}\n`,
        `☁️ Ты зарегистрировался ${formatDateToDDMMYYYY(user.registeredAt)}`,
        `☁️ Статус пасса: ${user.hasPass ? "активен" : "не активен"}`,
      ].join("\n"),
      Markup.inlineKeyboard([
        Markup.button.callback(BUTTONS.CLOSE, "DELETE_MESSAGE"),
      ])
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
