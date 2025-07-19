import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "@bot/features/scenes";
import { UserController, SquadController } from "@controller";
import { handleError } from "@utils/index";
import { SECTION_EMOJI } from "@utils/constants";

export const kickMemberScene = new Scenes.BaseScene<MyContext>("kickMember");

kickMemberScene.enter(async (ctx: MyContext) => {
  await ctx.reply(`${SECTION_EMOJI} Введи ник этого лейма`);
});

kickMemberScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const nickname = ctx.message.text.trim();

  if (!session.squadData) {
    await ctx.reply("🚫 Данные объединения не найдены. Попробуй снова.");
    return ctx.scene.leave();
  }

  try {
    const member = await UserController.findByNickname(accountId, nickname);

    if (!member) {
      await ctx.reply(`❌ <b>${nickname}</b> это вообще КТО?`, {
        parse_mode: "HTML",
      });
      return ctx.scene.leave();
    }

    const existMembership = await SquadController.findMembershipByUserId(
      member.accountId
    );

    if (
      !existMembership ||
      existMembership.squadName !== session.squadData.name
    ) {
      await ctx.reply(`❌ <b>${nickname}</b> не подписан на твой лейбл`, {
        parse_mode: "HTML",
      });
      return ctx.scene.leave();
    }

    await SquadController.deleteSquadMember(
      accountId,
      session.squadData.name,
      member.accountId
    );

    ctx.telegram.sendMessage(
      String(member.accountId),
      `🫵🏿 Ты больше не подписан на лейбл <b>${session.squadData.name}</b>`,
      { parse_mode: "HTML" }
    );

    await ctx.reply(`👨🏿‍⚖️ <b>${nickname}</b> больше не подписан на твой лейбл`, {
      parse_mode: "HTML",
    });
    await ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "kickMemberScene.on");
    return ctx.scene.leave();
  }
});
