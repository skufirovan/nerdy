import { SquadService } from "@core/index";
import { SquadDto, SquadMemberDto } from "@domain/dtos";
import { SquadMemberRole } from "@prisma/generated";

export class SquadController {
  static async createSquad(accountId: bigint, name: string): Promise<SquadDto> {
    try {
      const squad = await SquadService.createSquad(accountId, name);
      const dto = new SquadDto(squad);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async addMember(
    accountId: bigint,
    squadName: string,
    newMemberId: bigint
  ): Promise<SquadMemberDto> {
    try {
      const newMember = await SquadService.addMember(
        accountId,
        squadName,
        newMemberId
      );
      const dto = new SquadMemberDto(newMember);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findSquadByName(
    accountId: bigint,
    name: string
  ): Promise<SquadDto | null> {
    try {
      const squad = await SquadService.findSquadByName(accountId, name);
      if (!squad) return null;

      const dto = new SquadDto(squad);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findMembershipByUserId(
    accountId: bigint
  ): Promise<SquadMemberDto | null> {
    try {
      const membership = await SquadService.findMembershipByUserId(accountId);
      if (!membership) return null;
      const dto = new SquadMemberDto(membership);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findSquadMembers(
    accountId: bigint,
    squadName: string
  ): Promise<SquadMemberDto[]> {
    try {
      const members = await SquadService.findSquadMembers(accountId, squadName);
      const dtos = members.map((m) => new SquadMemberDto(m));
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSquad(
    accountId: bigint,
    squadName: string
  ): Promise<SquadDto> {
    try {
      const squad = await SquadService.deleteSquad(accountId, squadName);
      const dto = new SquadDto(squad);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSquadMember(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<SquadMemberDto | SquadDto> {
    try {
      const result = await SquadService.deleteSquadMember(
        accountId,
        squadName,
        userId
      );

      if ("role" in result) {
        return new SquadMemberDto(result);
      }

      return new SquadDto(result);
    } catch (error) {
      throw error;
    }
  }

  static async changeMemberRole(
    accountId: bigint,
    squadName: string,
    userId: bigint,
    role: SquadMemberRole
  ): Promise<SquadMemberDto> {
    try {
      const member = await SquadService.changeMemberRole(
        accountId,
        squadName,
        userId,
        role
      );
      const dto = new SquadMemberDto(member);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async transferOwnership(
    accountId: bigint,
    squadName: string,
    adminId: bigint
  ): Promise<SquadDto> {
    try {
      const squad = await SquadService.transferOwnership(
        accountId,
        squadName,
        adminId
      );
      const dto = new SquadDto(squad);
      return dto;
    } catch (error) {
      throw error;
    }
  }
}
