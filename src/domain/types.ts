import { Demo, User } from "@prisma/generated";
import DemoDto from "./dtos/DemoDto";

export type NON_UPDATABLE_USER_FIELDS = keyof Pick<
  User,
  "id" | "accountId" | "registeredAt"
>;

export type CreateDemoResult =
  | { ok: true; demo: Demo | DemoDto }
  | { ok: false; message: string };
