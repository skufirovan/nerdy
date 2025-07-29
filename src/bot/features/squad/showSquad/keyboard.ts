import { Markup } from "telegraf";
import { toButton } from "@utils/index";
import { SquadMemberRole } from "@prisma/generated";

export const CREATE_SQUAD_BUTTONS = {
  CREATE_SQUAD: {
    text: "👨🏿‍💼 Создать объединение",
    callback: "CREATE_SQUAD",
  },
};

export const createSquadKeyboard = Markup.inlineKeyboard([
  [toButton(CREATE_SQUAD_BUTTONS.CREATE_SQUAD)],
]);

export function getSquadKeyboardByRole(role: SquadMemberRole, adminId: bigint) {
  const BUTTONS = {
    KICK_MEMBER: {
      text: "👨🏿‍⚖️ Выгнать",
      callback: `KICK_MEMBER_${adminId}`,
    },
    INVITE_MEMBER: {
      text: "👶🏿 Пригласить",
      callback: `INVITE_MEMBER_${adminId}`,
    },
    LEAVE_SQUAD: {
      text: "🏃🏿 Покинуть объединение",
      callback: `LEAVE_SQUAD_${adminId}`,
    },
    CHANGE_ROLE: {
      text: "👨🏿‍💼 Настроить роли",
      callback: `PRE-CHANGE_ROLE_${adminId}`,
    },
    DELETE_SQUAD: {
      text: "👊🏿 Распустить",
      callback: `DELETE_SQUAD_${adminId}`,
    },
  };

  switch (role) {
    case SquadMemberRole.ADMIN:
      return Markup.inlineKeyboard([
        [toButton(BUTTONS.KICK_MEMBER)],
        [toButton(BUTTONS.INVITE_MEMBER)],
        [toButton(BUTTONS.LEAVE_SQUAD)],
        [toButton(BUTTONS.CHANGE_ROLE)],
        [toButton(BUTTONS.DELETE_SQUAD)],
      ]);
    case SquadMemberRole.RECRUITER:
      return Markup.inlineKeyboard([
        [toButton(BUTTONS.INVITE_MEMBER)],
        [toButton(BUTTONS.LEAVE_SQUAD)],
      ]);
    case SquadMemberRole.MEMBER:
    default:
      return Markup.inlineKeyboard([[toButton(BUTTONS.LEAVE_SQUAD)]]);
  }
}
