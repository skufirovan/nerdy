import { Demo } from "@prisma/generated";

export default class DemoDto {
  readonly name: string;
  readonly text: string;
  readonly recordedAt: Date;

  constructor(demo: Demo) {
    this.name = demo.name;
    this.text = demo.text;
    this.recordedAt = demo.recordedAt;
  }
}
