import { Prisma, User } from "@prisma/generated";

export type NON_UPDATABLE_USER_FIELDS = keyof Pick<
  User,
  "id" | "accountId" | "registeredAt"
>;

export type RawUser = {
  accountId: bigint;
  username: string | null;
};

export type UserEquipmentWithEquipment = Prisma.UserEquipmentGetPayload<{
  include: { equipment: true };
}>;
