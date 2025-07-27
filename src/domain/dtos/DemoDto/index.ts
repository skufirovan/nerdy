import { Demo } from "@prisma/generated";
import { UserDto } from "../UserDto";
import { DemoWithUser } from "@domain/types";

export class DemoDto {
  readonly id: bigint;
  readonly accountId: bigint;
  readonly name: string;
  readonly text: string | null;
  readonly fileId: string | null;
  readonly recordedAt: Date;

  constructor(demo: Demo) {
    this.id = demo.id;
    this.accountId = demo.accountId;
    this.name = demo.name;
    this.text = demo.text;
    this.fileId = demo.fileId;
    this.recordedAt = demo.recordedAt;
  }
}

export class DemoWithUserDto {
  readonly id: bigint;
  readonly accountId: bigint;
  readonly name: string;
  readonly text: string | null;
  readonly fileId: string | null;
  readonly recordedAt: Date;
  readonly user: UserDto;

  constructor(demo: DemoWithUser) {
    this.id = demo.id;
    this.accountId = demo.accountId;
    this.name = demo.name;
    this.text = demo.text;
    this.fileId = demo.fileId;
    this.recordedAt = demo.recordedAt;
    this.user = new UserDto(demo.user);
  }
}
