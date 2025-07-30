import { UserController } from "@controller/index";

export async function handlePurchase(
  accountId: bigint,
  invoicePayload: string
) {
  const product = invoicePayload.split("_")[0];

  switch (product) {
    case "NERD PASS":
      const passExpiresAt = new Date();
      passExpiresAt.setMonth(passExpiresAt.getMonth() + 1);

      await UserController.updateUserInfo(accountId, {
        hasPass: true,
        passExpiresAt,
      });
      break;
  }
}
