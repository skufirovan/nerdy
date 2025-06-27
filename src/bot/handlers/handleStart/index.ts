import { MyContext } from "@bot/scenes";
import { keyboards } from "@bot/markup/keyboards";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { CHANNEL_LINK, SECTION_EMOJI } from "@bot/markup/constants";

export const handleStart = async (ctx: MyContext) => {
  const accountId = ctx.from?.id ? BigInt(ctx.from.id) : null;
  const username = ctx.from?.username ?? null;

  const meta = {
    accountId,
    username,
  };

  try {
    return await ctx.reply(
      [
        `${SECTION_EMOJI} Ты в [NERDY](${CHANNEL_LINK}) — игре, где тебе предстоит подняться с самого дна ск айсберга\n`,
        `➖ Тут все просто — закупай оборудку, пиши демочки, записывай диссы на леймов\n`,
        `➖ Путь не будет лёгким, запомни: первая демка — всегда комо\n`,
        `📍Не пропусти важные обновления: ${CHANNEL_LINK}`,
      ].join("\n"),
      {
        parse_mode: "Markdown",
        ...keyboards.main,
      }
    );
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
