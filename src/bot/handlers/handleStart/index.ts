import { MyContext, SessionData } from "@bot/features/scenes";
import { UserController } from "@controller/index";
import { mainKeyboard } from "./keyboard";
import { CHANNEL_LINK, SECTION_EMOJI } from "@utils/constants";
import { handleError } from "@utils/index";

export const handleStart = async (ctx: MyContext) => {
  const accountId = ctx.user!.accountId;

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
        link_preview_options: {
          is_disabled: true,
        },
        ...mainKeyboard,
      }
    );

    let user = await UserController.findByAccountId(accountId);
    if (!user || user.username !== ctx.user!.username) {
      const session = ctx.session as SessionData;
      const rawPayload = ctx.startPayload;
      session.referral =
        rawPayload && /^\d+$/.test(rawPayload) ? BigInt(rawPayload) : null;
      await ctx.scene.enter("userInit");
    }
  } catch (error) {
    await handleError(ctx, error, "handleStart");
  }
};
