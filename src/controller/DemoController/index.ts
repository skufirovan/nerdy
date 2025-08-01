import { DemoService } from "@core/index";
import { DemoDto, DemoWithUserDto } from "@domain/dtos";
import { NON_UPDATABLE_DEMO_FIELDS } from "@domain/types";
import { Demo } from "@prisma/generated";

export class DemoController {
  static async create(
    accountId: bigint,
    name: string,
    text: string | null,
    fileId: string | null,
    messageId: number | null
  ): Promise<DemoDto> {
    try {
      const demo = await DemoService.create(
        accountId,
        name,
        text,
        fileId,
        messageId
      );
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

  static async updateDemoInfo(
    accountId: bigint,
    id: bigint,
    data: Partial<Omit<Demo, NON_UPDATABLE_DEMO_FIELDS>>
  ): Promise<DemoDto> {
    try {
      const updatedDemo = await DemoService.updateDemoInfo(accountId, id, data);

      const dto = new DemoDto(updatedDemo);
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

  static async canDistribute(accountId: bigint): Promise<boolean> {
    try {
      const canDistribute = await DemoService.canDistribute(accountId);

      return canDistribute;
    } catch (error) {
      throw error;
    }
  }
}
