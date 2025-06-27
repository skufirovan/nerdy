import DemoService from "@core/DemoService";
import DemoDto from "@domain/dtos/DemoDto";
import { CreateDemoResult } from "@domain/types";
import { Demo } from "@prisma/generated";

export default class DemoController {
  static async create(
    accountId: bigint,
    name: string,
    text: string
  ): Promise<DemoDto | null> {
    try {
      const result = await DemoService.create(accountId, name, text);

      if (!result) return null;

      const dto = new DemoDto(result);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByAccountId(accountId: bigint): Promise<DemoDto[] | null> {
    try {
      const demos = await DemoService.findByAccountId(accountId);

      if (!demos) return null;

      const dtos: DemoDto[] = demos.map((demo) => new DemoDto(demo));
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async delete(accountId: bigint, name: string): Promise<DemoDto> {
    try {
      const demo = await await DemoService.delete(accountId, name);
      const dto = new DemoDto(demo);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async canRecord(accountId: bigint) {
    try {
      const { canRecord, remainingTimeText } = await DemoService.canRecord(
        accountId
      );

      if (!canRecord) {
        return { ok: false, message: remainingTimeText! };
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
