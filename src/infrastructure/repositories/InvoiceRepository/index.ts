import { PaymentWithInvoice } from "@domain/types";
import { prisma } from "@prisma/client";
import { Invoice } from "@prisma/generated";

export class InvoiceRepository {
  static async createInvoice(
    userId: bigint,
    product: string,
    amount: number,
    payload: string
  ): Promise<Invoice> {
    return await prisma.invoice.create({
      data: {
        userId,
        product,
        amount,
        payload,
      },
    });
  }

  static async createPayment(
    userId: bigint,
    paymentId: string,
    invoiceId: bigint,
    amount: number
  ): Promise<PaymentWithInvoice> {
    return await prisma.payment.create({
      data: {
        userId,
        paymentId,
        invoiceId,
        amount,
      },
      include: { invoice: true },
    });
  }

  static async findInvoiceByPayload(payload: string): Promise<Invoice | null> {
    return await prisma.invoice.findUnique({
      where: { payload },
    });
  }
}
