import { Context, Markup } from "telegraf";
import UserController from "@controller/UserController";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { BUTTONS } from "@infrastructure/telegram/buttons";
import { formatDateToDDMMYYYY } from "@utils/index";

export const handleProfile = async (ctx: Context) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = {
    accountId,
    username,
  };

  if (!accountId) {
    return ctx.reply("⚠️ Не удалось определить ваш Telegram ID");
  }

  try {
    let user = await UserController.getByAccountId(accountId);

    if (!user) {
      user = await UserController.register(accountId, username);
    }

    await ctx.reply(
      `👋 Васап, ${
        user.nickname ?? "игрок"
      }\n📆 Ты зарегистрировался ${formatDateToDDMMYYYY(
        user.registeredAt
      )}\n👑 Статус пасса: ${user.hasPass ? "активен" : "не активен"}`,
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
