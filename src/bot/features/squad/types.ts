import { SquadMemberRole } from "@prisma/generated";

export type SquadActions =
  | "ADD"
  | "DELETE_MEMBER"
  | "CHANGE_ROLE"
  | "DELETE_SQUAD"
  | "TRANSFER_OWNERSHIP";

export type SquadData = {
  requesterId?: bigint;
  name?: string;
  targetUser?: {
    accountId?: bigint;
    intendedRole?: SquadMemberRole;
    action?: SquadActions;
  };
};
