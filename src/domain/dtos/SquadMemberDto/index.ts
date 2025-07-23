import { SquadMember, SquadMemberRole } from "@prisma/generated";
import { SquadMemberWithUserAndSquad } from "@domain/types";
import { UserDto } from "../UserDto";
import { SquadDto } from "../SquadDto";

export class SquadMemberDto {
  readonly squadName: string;
  readonly accountId: bigint;
  readonly role: SquadMemberRole;
  readonly joinedAt: Date;

  constructor(squadMember: SquadMember) {
    this.squadName = squadMember.squadName;
    this.accountId = squadMember.accountId;
    this.role = squadMember.role;
    this.joinedAt = squadMember.joinedAt;
  }
}

export class SquadMemberWithUserAndSquadDto {
  readonly squadName: string;
  readonly accountId: bigint;
  readonly role: SquadMemberRole;
  readonly joinedAt: Date;
  readonly user: UserDto;
  readonly squad: SquadDto;

  constructor(squadMember: SquadMemberWithUserAndSquad) {
    this.squadName = squadMember.squadName;
    this.accountId = squadMember.accountId;
    this.role = squadMember.role;
    this.joinedAt = squadMember.joinedAt;
    this.user = new UserDto(squadMember.user);
    this.squad = new SquadDto(squadMember.squad);
  }
}
