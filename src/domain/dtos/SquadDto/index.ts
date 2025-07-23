import { Squad } from "@prisma/generated";
import { SquadWithMembers } from "@domain/types";
import { SquadMemberWithUserAndSquadDto } from "../SquadMemberDto";

export class SquadDto {
  readonly capacity: number;
  readonly name: string;
  readonly adminId: bigint;
  readonly seasonalFame: number;
  readonly photo: string;

  constructor(squad: Squad) {
    this.capacity = squad.capacity;
    this.name = squad.name;
    this.adminId = squad.adminId;
    this.seasonalFame = squad.seasonalFame;
    this.photo = squad.photo;
  }
}

export class SquadWithMembersDto {
  readonly capacity: number;
  readonly name: string;
  readonly adminId: bigint;
  readonly seasonalFame: number;
  readonly photo: string;
  readonly members: SquadMemberWithUserAndSquadDto[];

  constructor(squad: SquadWithMembers) {
    this.capacity = squad.capacity;
    this.name = squad.name;
    this.adminId = squad.adminId;
    this.seasonalFame = squad.seasonalFame;
    this.photo = squad.photo;
    this.members = squad.members.map(
      (m) => new SquadMemberWithUserAndSquadDto(m)
    );
  }
}
