import { Demo } from "@prisma/generated";

export class DemoDto {
  readonly accountId: bigint;
  readonly name: string;
  readonly text: string;
  readonly recordedAt: Date;

  constructor(demo: Demo) {
    this.accountId = demo.accountId;
    this.name = demo.name;
    this.text = demo.text;
    this.recordedAt = demo.recordedAt;
  }
}
