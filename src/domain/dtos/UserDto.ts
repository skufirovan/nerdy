import { User } from "@prisma/generated";

export default class UserDto {
  readonly username: string | null;
  readonly nickname: string | null;
  readonly hasPass: boolean;
  readonly passExpiresAt: Date | null;
  readonly registeredAt: Date;

  constructor(user: User) {
    this.username = user.username;
    this.nickname = user.nickname;
    this.hasPass = user.hasPass;
    this.passExpiresAt = user.passExpiresAt;
    this.registeredAt = user.registeredAt;
  }
}
