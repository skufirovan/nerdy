import { UserController } from "@controller/index";

export async function handlePurchase(accountId: bigint, product: string) {
  const user = await UserController.findByAccountId(accountId);
  if (!user) return;

  switch (product) {
    case "NERD PASS":
      const passExpiresAt = user.passExpiresAt ?? new Date();
      passExpiresAt.setMonth(passExpiresAt.getMonth() + 1);

      await UserController.updateUserInfo(accountId, {
        hasPass: true,
        passExpiresAt,
      });
      break;
  }
}
