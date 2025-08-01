import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { MyContext, SessionData } from "@bot/features/scenes";
import { UserController, SquadController } from "@controller/index";
import { SECTION_EMOJI } from "@utils/constants";
import { handleError } from "@utils/index";

export const changeSquadMemberRoleScene = new Scenes.BaseScene<MyContext>(
  "changeSquadMemberRole"
);

changeSquadMemberRoleScene.enter(async (ctx: MyContext) => {
  await ctx.reply(`${SECTION_EMOJI} Введи ник участника лейбла`);
});

changeSquadMemberRoleScene.on(message("text"), async (ctx: MyContext) => {
  if (!ctx.message || !("text" in ctx.message))
    return await ctx.reply("⚠️ Отправь текст ТЕКСТ #ТЕКСТ");

  const accountId = ctx.user!.accountId;
  const session = ctx.session as SessionData;
  const squadData = session.squadData;
  const msg = ctx.message.text.trim();

  if (!squadData) {
    await ctx.reply("🚫 Данные объединения не найдены. Попробуй снова.");
    return await ctx.scene.leave();
  }

  const roleMap: Record<string, "ADMIN" | "RECRUITER" | "MEMBER"> = {
    ceo: "ADMIN",
    ar: "RECRUITER",
    подписант: "MEMBER",
  };

  try {
    if (!squadData.targetUser?.accountId) {
      const member = await UserController.findByNickname(accountId, msg);

      if (!member) {
        await ctx.reply(`❌ <b>${msg}</b> это вообще КТО?`, {
          parse_mode: "HTML",
        });
        return ctx.scene.leave();
      }

      const existMembership = await SquadController.findMembershipByUserId(
        member.accountId
      );

      if (
        !existMembership ||
        existMembership.squad.adminId !== squadData.adminId
      ) {
        await ctx.reply(`❌ <b>${msg}</b> не подписан на твой лейбл`, {
          parse_mode: "HTML",
        });
        return ctx.scene.leave();
      }

      squadData.name = existMembership.squad.name;
      squadData.targetUser = { accountId: member.accountId };
      const text = [
        `${SECTION_EMOJI} Напиши новую роль для <b>${msg}</b>\n`,
        "▫️ <code>CEO</code> — Полные права",
        "▫️ <code>AR</code> — Может приглашать",
        "▫️ <code>Подписант</code> — Просто участник",
      ];

      return await ctx.reply(text.join("\n"), { parse_mode: "HTML" });
    }

    const normalizedMsg = msg.toLowerCase();
    const intendedRole = roleMap[normalizedMsg];

    if (!intendedRole) {
      await ctx.reply("⚠️ Неизвестная роль. Попробуй заново", {
        parse_mode: "HTML",
      });
      return ctx.scene.leave();
    }

    if (intendedRole === "ADMIN") {
      await SquadController.transferOwnership(
        accountId,
        squadData.name!,
        squadData.targetUser!.accountId
      );
    } else {
      await SquadController.changeMemberRole(
        accountId,
        squadData.name!,
        squadData.targetUser!.accountId,
        intendedRole
      );
    }

    await ctx.reply(`${SECTION_EMOJI} Роль успешно изменена на <b>${msg}</b>`, {
      parse_mode: "HTML",
    });
    return ctx.scene.leave();
  } catch (error) {
    await handleError(ctx, error, "changeSquadMemberRoleScene.on");
    return ctx.scene.leave();
  }
});
