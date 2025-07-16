import { Squad } from "@prisma/generated";

export class SquadDto {
  readonly capacity: number;
  readonly name: string;
  readonly adminId: bigint;

  constructor(squad: Squad) {
    this.capacity = squad.capacity;
    this.name = squad.name;
    this.adminId = squad.adminId;
  }
}
