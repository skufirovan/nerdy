import { SquadMemberRole } from "@prisma/generated";
import { SquadMemberWithUser } from "@domain/types";
import { UserDto } from "../UserDto";

export class SquadMemberDto {
  readonly squadName: string;
  readonly accountId: bigint;
  readonly role: SquadMemberRole;
  readonly joinedAt: Date;
  readonly user: UserDto;

  constructor(squadMember: SquadMemberWithUser) {
    this.squadName = squadMember.squadName;
    this.accountId = squadMember.accountId;
    this.role = squadMember.role;
    this.joinedAt = squadMember.joinedAt;
    this.user = new UserDto(squadMember.user);
  }
}
