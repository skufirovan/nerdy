import { Prisma, Squad, User } from "@prisma/generated";

export type NON_UPDATABLE_USER_FIELDS = keyof Pick<
  User,
  "id" | "accountId" | "registeredAt"
>;

export type NON_UPDATABLE_SQUAD_FIELDS = keyof Pick<Squad, "id">;

export type RawUser = {
  accountId: bigint;
  username: string | null;
};

export type UserEquipmentWithEquipment = Prisma.UserEquipmentGetPayload<{
  include: { equipment: true };
}>;

export type SquadMemberWithUserAndSquad = Prisma.SquadMemberGetPayload<{
  include: { user: true; squad: true };
}>;

export type SquadWithMembers = Prisma.SquadGetPayload<{
  include: {
    members: {
      include: {
        user: true;
        squad: true;
      };
    };
  };
}>;

export type PaymentWithInvoice = Prisma.PaymentGetPayload<{
  include: { invoice: true };
}>;

export type DemoWithUser = Prisma.DemoGetPayload<{
  include: { user: true };
}>;

export type DistributedDemoWithDemoAndLikes = Prisma.DistributedDemoGetPayload<{
  include: {
    demo: {
      include: {
        user: true;
      };
    };
    likes: true;
  };
}>;
