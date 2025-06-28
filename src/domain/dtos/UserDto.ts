import { User } from "@prisma/generated";

export default class UserDto {
  readonly accountId: bigint;
  readonly username: string | null;
  readonly nickname: string | null;
  readonly hasPass: boolean;
  readonly passExpiresAt: Date | null;
  readonly lastDemoRecordedAt: Date | null;
  readonly registeredAt: Date;

  constructor(user: User) {
    this.accountId = user.accountId;
    this.username = user.username;
    this.nickname = user.nickname;
    this.hasPass = user.hasPass;
    this.passExpiresAt = user.passExpiresAt;
    this.lastDemoRecordedAt = user.lastDemoRecordedAt;
    this.registeredAt = user.registeredAt;
  }
}
