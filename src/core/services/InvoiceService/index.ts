import { InvoiceRepository } from "@infrastructure/repositories";
import { serviceLogger } from "@infrastructure/logger";
import { PaymentWithInvoice } from "@domain/types";
import { Invoice } from "@prisma/generated";

export class InvoiceService {
  static async createInvoice(
    userId: bigint,
    product: string,
    amount: number,
    payload: string
  ): Promise<Invoice> {
    try {
      const invoice = await InvoiceRepository.createInvoice(
        userId,
        product,
        amount,
        payload
      );

      return invoice;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "InvoiceService.createInvoice",
        `Ошибка при создании счета: ${err}`,
        { accountId: userId }
      );
      throw new Error("Ошибка при создании счета");
    }
  }

  static async createPayment(
    userId: bigint,
    paymentId: string,
    invoiceId: bigint,
    amount: number
  ): Promise<PaymentWithInvoice> {
    try {
      const payment = await InvoiceRepository.createPayment(
        userId,
        paymentId,
        invoiceId,
        amount
      );

      serviceLogger(
        "info",
        "InvoiceService.createPayment",
        `Новая покупка ${payment.invoice.payload}`
      );

      return payment;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "InvoiceService.createPayment",
        `Ошибка при создании чека: ${err}`,
        { accountId: userId }
      );
      throw new Error("Ошибка при создании чека");
    }
  }

  static async findInvoiceByPayload(
    accountId: bigint,
    payload: string
  ): Promise<Invoice | null> {
    try {
      const invoice = await InvoiceRepository.findInvoiceByPayload(payload);

      return invoice;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "InvoiceService.findInvoiceByPayload",
        `Ошибка при поиске счета: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при поиске счета");
    }
  }
}
