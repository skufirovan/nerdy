import { MyContext } from "@bot/scenes";
import { keyboards } from "@bot/markup/keyboards";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";

export const handleStart = async (ctx: MyContext) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = {
    accountId,
    username,
  };

  try {
    const user = ctx.user;

    await ctx.reply(
      [
        `👨🏿‍🦲 Ты в [NERDY](https://t.me/nerdy4ever) — игре, где тебе предстоит подняться с самого дна ск айсберга\n`,
        `➖ Тут все просто — закупай оборудку, пиши демочки, записывай диссы на леймов\n`,
        `➖ Путь не будет лёгким, запомни: первая демка — всегда комо\n`,
        `📍Не пропусти важные обновления: https://t.me/nerdy4ever`,
      ].join("\n"),
      {
        parse_mode: "Markdown",
      }
    );

    if (user.nickname) {
      return await ctx.reply(
        `${user?.nickname}, это ты, братик? Сори не признал`,
        keyboards.main
      );
    }

    return await ctx.scene.enter("chooseNickname", { accountId });
  } catch (error) {
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");

    userActionsLogger(
      "error",
      "handleStart",
      `Произошла ошибка при выполнении /start: ${(error as Error).message}`,
      meta
    );
  }
};
