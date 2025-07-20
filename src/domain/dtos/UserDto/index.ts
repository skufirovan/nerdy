import { User } from "@prisma/generated";

export class UserDto {
  readonly accountId: bigint;
  readonly username: string | null;
  readonly nickname: string | null;
  readonly level: number;
  readonly fame: number;
  readonly seasonalFame: number;
  readonly racks: number;
  readonly hasPass: boolean;
  readonly invitedUsersCount: number;
  readonly passExpiresAt: Date | null;
  readonly lastDemoRecordedAt: Date | null;
  readonly registeredAt: Date;

  constructor(user: User) {
    this.accountId = user.accountId;
    this.username = user.username;
    this.nickname = user.nickname;
    this.level = user.level;
    this.fame = user.fame;
    this.seasonalFame = user.seasonalFame;
    this.racks = user.racks;
    this.hasPass = user.hasPass;
    this.invitedUsersCount = user.invitedUsersCount;
    this.passExpiresAt = user.passExpiresAt;
    this.lastDemoRecordedAt = user.lastDemoRecordedAt;
    this.registeredAt = user.registeredAt;
  }
}
