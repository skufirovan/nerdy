import { DemoService } from "@core/index";
import { DemoDto, DemoWithUserDto } from "@domain/dtos";

export class DemoController {
  static async create(
    accountId: bigint,
    name: string,
    text: string | null,
    fileId: string | null
  ): Promise<DemoDto> {
    try {
      const demo = await DemoService.create(accountId, name, text, fileId);
      const dto = new DemoDto(demo);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findByAccountId(accountId: bigint): Promise<DemoDto[]> {
    try {
      const demos = await DemoService.findByAccountId(accountId);

      const dtos: DemoDto[] = demos.map((demo) => new DemoDto(demo));
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async findByName(
    accountId: bigint,
    name: string
  ): Promise<DemoWithUserDto | null> {
    try {
      const demo = await DemoService.findByName(accountId, name);

      if (!demo) return null;

      const dto = new DemoWithUserDto(demo);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async delete(accountId: bigint, name: string): Promise<DemoDto> {
    try {
      const demo = await DemoService.delete(accountId, name);
      const dto = new DemoDto(demo);

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async canRecord(
    accountId: bigint
  ): Promise<{ canRecord: boolean; remainingTimeText?: string }> {
    try {
      const { canRecord, remainingTimeText } = await DemoService.canRecord(
        accountId
      );

      if (!canRecord) {
        return { canRecord: false, remainingTimeText: remainingTimeText! };
      }

      return { canRecord: true };
    } catch (error) {
      throw error;
    }
  }
}
