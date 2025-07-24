import { InvoiceService } from "@core/index";
import { PaymentWithInvoice } from "@domain/types";
import { Invoice } from "@prisma/generated";

export class InvoiceController {
  static async createInvoice(
    userId: bigint,
    product: string,
    amount: number,
    payload: string
  ): Promise<Invoice> {
    try {
      const invoice = await InvoiceService.createInvoice(
        userId,
        product,
        amount,
        payload
      );

      return invoice;
    } catch (error) {
      throw error;
    }
  }

  static async createPayment(
    userId: bigint,
    paymentId: string,
    invoiceId: bigint,
    amount: number
  ): Promise<PaymentWithInvoice> {
    try {
      const payment = await InvoiceService.createPayment(
        userId,
        paymentId,
        invoiceId,
        amount
      );

      return payment;
    } catch (error) {
      throw error;
    }
  }

  static async findInvoiceByPayload(
    accountId: bigint,
    payload: string
  ): Promise<Invoice | null> {
    try {
      const invoice = await InvoiceService.findInvoiceByPayload(
        accountId,
        payload
      );

      return invoice;
    } catch (error) {
      throw error;
    }
  }
}
