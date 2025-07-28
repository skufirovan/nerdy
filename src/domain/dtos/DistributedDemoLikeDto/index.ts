import { DistributedDemoLike } from "@prisma/generated";

export class DistributedDemoLikeDto {
  readonly accountId: bigint;
  readonly distributedDemoId: bigint;
  readonly createdAt: Date;

  constructor(distributedDemoLike: DistributedDemoLike) {
    this.accountId = distributedDemoLike.accountId;
    this.distributedDemoId = distributedDemoLike.distributedDemoId;
    this.createdAt = distributedDemoLike.createdAt;
  }
}
