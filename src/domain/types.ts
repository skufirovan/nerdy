import { User } from "@prisma/generated";

export type NON_UPDATABLE_USER_FIELDS = keyof Pick<
  User,
  "id" | "accountId" | "registeredAt"
>;
