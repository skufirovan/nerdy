import { DistributedDemo } from "@prisma/generated";
import { DemoDto } from "../DemoDto";
import { UserDto } from "../UserDto";
import { DistributedDemoLikeDto } from "../DistributedDemoLikeDto";
import { DistributedDemoWithDemoAndLikes } from "@domain/types";

export class DistributedDemoDto {
  readonly id: bigint;
  readonly demoId: bigint;

  constructor(distributedDemo: DistributedDemo) {
    this.id = distributedDemo.id;
    this.demoId = distributedDemo.demoId;
  }
}

export class DistributedDemoWithDemoAndLikesDto {
  readonly id: bigint;
  readonly demoId: bigint;
  readonly demo: DemoDto;
  readonly user: UserDto;
  readonly likes: DistributedDemoLikeDto[];

  constructor(distributedDemo: DistributedDemoWithDemoAndLikes) {
    this.id = distributedDemo.id;
    this.demoId = distributedDemo.demoId;
    this.demo = new DemoDto(distributedDemo.demo);
    this.user = new UserDto(distributedDemo.demo.user);
    this.likes = distributedDemo.likes.map(
      (i) => new DistributedDemoLikeDto(i)
    );
  }
}
