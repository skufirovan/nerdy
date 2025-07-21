import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { MyContext } from "../scenes";
import { UserController } from "@controller";
import { PROFILE_BUTTONS } from "@bot/handlers";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

config();

export const showReferralAction = (bot: Telegraf<MyContext>) => {
  bot.action(PROFILE_BUTTONS.REFERRAL.callback, async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const accountId = ctx.user!.accountId;
      const BOT_LINK = process.env.BOT_LINK!;
      const REFERRAL_LINK = `${BOT_LINK}?start=${accountId}`;

      const user = await UserController.findByAccountId(accountId);

      const text = [
        `${SECTION_EMOJI} Подтягивай своих кентов в игру и получай за каждого 1000 рексов\n`,
        `Твоя рефка: ${REFERRAL_LINK}\n`,
        `Количество подтянутых кентов: ${user?.invitedUsersCount ?? 0}`,
      ].join("\n");

      await ctx.reply(text);
    } catch (error) {
      await handleError(ctx, error, "showReferralAction");
    }
  });
};
