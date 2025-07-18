import { MyContext, SessionData } from "@bot/features/scenes";
import { UserController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { mainKeyboard } from "./keyboard";
import { CHANNEL_LINK, SECTION_EMOJI } from "@utils/constants";

export const handleStart = async (ctx: MyContext) => {
  const accountId = ctx.user!.accountId;
  const username = ctx.user!.username;

  try {
    await ctx.reply(
      [
        `${SECTION_EMOJI} Ты в [NERDY](${CHANNEL_LINK}) — игре, где тебе предстоит подняться с самого дна ск айсберга\n`,
        `➖ Тут все просто — закупай оборудку, пиши демочки, записывай диссы на леймов\n`,
        `➖ Путь не будет лёгким, запомни: первая демка — всегда комом\n`,
        `📍Не пропусти важные обновления: ${CHANNEL_LINK}`,
      ].join("\n"),
      {
        parse_mode: "Markdown",
        ...mainKeyboard,
      }
    );

    let user = await UserController.findByAccountId(accountId);
    if (!user) {
      const session = ctx.session as SessionData;
      const rawPayload = ctx.startPayload;
      session.referral =
        rawPayload && /^\d+$/.test(rawPayload) ? BigInt(rawPayload) : null;
      await ctx.scene.enter("userInit");
    }
  } catch (error) {
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");

    userActionsLogger(
      "error",
      "handleStart",
      `Произошла ошибка при выполнении /start: ${(error as Error).message}`,
      { accountId, username }
    );
  }
};
