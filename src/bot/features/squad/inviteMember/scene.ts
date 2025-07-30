import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "@bot/features/scenes";
import { UserController, SquadController } from "@controller/index";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const inviteMemberScene = new Scenes.BaseScene<MyContext>(
  "inviteMember"
);

inviteMemberScene.enter(async (ctx: MyContext) => {
  await ctx.reply(`${SECTION_EMOJI} Введи ник нового подписанта`);
});

inviteMemberScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const newMemberNickname = ctx.message.text.trim();

  if (!session.squadData) {
    await ctx.reply("🚫 Данные объединения не найдены. Попробуй снова.");
    return ctx.scene.leave();
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
      return ctx.scene.leave();
    }

    const existMembership = await SquadController.findMembershipByUserId(
      newMember.accountId
    );

    if (existMembership) {
      await ctx.reply(`❌ <b>${newMemberNickname}</b> уже подписан на лейбл`, {
        parse_mode: "HTML",
      });
      return ctx.scene.leave();
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
                callback_data: `SQUAD_INVITE_ACCEPT_${session.squadData.adminId}_${session.squadData.requesterId}_${newMember.accountId}`,
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
    await handleError(ctx, error, "inviteMemberScene.on");
    return ctx.scene.leave();
  }
});
