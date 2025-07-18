import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { PROFILE_BUTTONS } from "@bot/handlers";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { SECTION_EMOJI } from "@utils/constants";
import { UserController } from "@controller";

config();

export const showReferralAction = (bot: Telegraf<MyContext>) => {
  bot.action(PROFILE_BUTTONS.REFERRAL.callback, async (ctx) => {
    const accountId = ctx.user!.accountId;
    try {
      await ctx.answerCbQuery();
      const user = await UserController.findByAccountId(accountId);
      const BOT_LINK = process.env.BOT_LINK!;
      const REFERRAL_LINK = `${BOT_LINK}?start=${accountId}`;
      const text = [
        `${SECTION_EMOJI} Подтягивай своих кентов в игру и получай за это ништяки (скоро)\n`,
        `Твоя рефка: ${REFERRAL_LINK}\n`,
        `Количество подтянутых кентов: ${user?.invitedUsersCount ?? 0}`,
      ].join("\n");
      await ctx.reply(text);
    } catch (error) {
      userActionsLogger(
        "error",
        "showReferralAction",
        `${(error as Error).message}`,
        { accountId }
      );
      await ctx.reply("❌ Не удалось открыть раздел. Попробуй позже.");
    }
  });
};
