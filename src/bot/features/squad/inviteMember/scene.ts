import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "@bot/features/scenes";
import { UserController, SquadController } from "@controller";
import userActionsLogger from "@infrastructure/logger/userActionsLogger";
import { SECTION_EMOJI } from "@utils/constants";

export const inviteMemberScene = new Scenes.BaseScene<MyContext>(
  "inviteMember"
);

inviteMemberScene.enter(async (ctx: MyContext) => {
  await ctx.reply(`${SECTION_EMOJI} Введи ник нового подписанта`);
});

inviteMemberScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message)) {
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");
  }

  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const newMemberNickname = ctx.message.text.trim();

  if (!session.squadData) {
    await ctx.reply("🚫 Данные объединения не найдены. Попробуй снова.");
    return await ctx.scene.leave();
  }

  try {
    const newMember = await UserController.findByNickname(
      accountId,
      newMemberNickname
    );

    if (!newMember) {
      await ctx.reply(`❌ <b>${newMemberNickname}</b> это вообще КТО?`, {
        parse_mode: "HTML",
      });
      return await ctx.scene.leave();
    }

    const existMembership = await SquadController.findMembershipByUserId(
      newMember.accountId
    );

    if (existMembership) {
      await ctx.reply(`❌ <b>${newMemberNickname}</b> уже подписан на лейбл`, {
        parse_mode: "HTML",
      });
      return await ctx.scene.leave();
    }

    ctx.telegram.sendMessage(
      String(newMember.accountId),
      `${SECTION_EMOJI} Тебя хотят подписать на лейбл <b>${session.squadData.name}</b>`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Принять",
                callback_data: `SQUAD_INVITE_ACCEPT_${session.squadData.name}_${session.squadData.requesterId}_${newMember.accountId}`,
              },
              {
                text: "❌ Отклонить",
                callback_data: `SQUAD_INVITE_DECLINE`,
              },
            ],
          ],
        },
      }
    );
    await ctx.reply(
      `✍🏿 <b>${newMemberNickname}</b> внимательно читает договор..`,
      { parse_mode: "HTML" }
    );
    await ctx.scene.leave();
  } catch (error) {
    userActionsLogger(
      "error",
      "inviteMemberScene",
      `${(error as Error).message}`,
      { accountId }
    );
    await ctx.reply("🚫 Произошла ошибка. Попробуйте позже.");
  }
});
