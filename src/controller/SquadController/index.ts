import { SquadService } from "@core/index";
import { InMemoryCache } from "@infrastructure/cache";
import {
  SquadDto,
  SquadMemberWithUserAndSquadDto,
  SquadWithMembersDto,
} from "@domain/dtos";
import { NON_UPDATABLE_SQUAD_FIELDS } from "@domain/types";
import { Squad, SquadMemberRole } from "@prisma/generated";

const TTL = 5 * 60 * 1000;
const cache = new InMemoryCache<"top_squads", SquadWithMembersDto[]>(TTL);

export class SquadController {
  static async createSquad(
    accountId: bigint,
    name: string,
    photo: string,
    fileUrl: string
  ): Promise<SquadDto> {
    try {
      const squad = await SquadService.createSquad(
        accountId,
        name,
        photo,
        fileUrl
      );
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
  ): Promise<SquadMemberWithUserAndSquadDto> {
    try {
      const newMember = await SquadService.addMember(
        accountId,
        squadName,
        newMemberId
      );
      const dto = new SquadMemberWithUserAndSquadDto(newMember);
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
  ): Promise<SquadMemberWithUserAndSquadDto | null> {
    try {
      const membership = await SquadService.findMembershipByUserId(accountId);
      if (!membership) return null;
      const dto = new SquadMemberWithUserAndSquadDto(membership);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async findSquadMembers(
    accountId: bigint,
    squadName: string
  ): Promise<SquadMemberWithUserAndSquadDto[]> {
    try {
      const members = await SquadService.findSquadMembers(accountId, squadName);
      const dtos = members.map((m) => new SquadMemberWithUserAndSquadDto(m));
      return dtos;
    } catch (error) {
      throw error;
    }
  }

  static async findTopSquads(
    accountId: bigint,
    limit: number = 10
  ): Promise<SquadWithMembersDto[]> {
    try {
      const cacheKey = "top_squads";

      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const topSquads = await SquadService.findTopSquads(accountId, limit);

      const dtos = topSquads.map((s) => new SquadWithMembersDto(s));
      cache.set(cacheKey, dtos);

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

      const cacheKey = "top_squads";
      const cached = cache.get(cacheKey);
      if (cached) {
        const updatedCache = cached.filter((s) => s.name !== squadName);
        cache.set(cacheKey, updatedCache);
      }

      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSquadMember(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<SquadMemberWithUserAndSquadDto | SquadDto> {
    try {
      const result = await SquadService.deleteSquadMember(
        accountId,
        squadName,
        userId
      );

      const cacheKey = "top_squads";
      const cached = cache.get(cacheKey);

      if ("name" in result) {
        if (cached) {
          const updatedCache = cached.filter((s) => s.name !== squadName);
          cache.set(cacheKey, updatedCache);
        }
        return new SquadDto(result);
      }

      if (cached) {
        const updatedCache = cached.map((s) => {
          if (s.name === squadName) {
            return {
              ...s,
              members: s.members.filter((m) => m.accountId !== userId),
            };
          }
          return s;
        });
        cache.set(cacheKey, updatedCache);
      }

      return new SquadMemberWithUserAndSquadDto(result);
    } catch (error) {
      throw error;
    }
  }

  static async updateSquadInfo(
    accountId: bigint,
    squadName: string,
    data: Partial<Omit<Squad, NON_UPDATABLE_SQUAD_FIELDS>>
  ): Promise<SquadDto> {
    try {
      const updatedSquad = await SquadService.updateSquadInfo(
        accountId,
        squadName,
        data
      );

      const dto = new SquadDto(updatedSquad);
      return dto;
    } catch (error) {
      throw error;
    }
  }

  static async changeMemberRole(
    accountId: bigint,
    squadName: string,
    userId: bigint,
    role: SquadMemberRole
  ): Promise<SquadMemberWithUserAndSquadDto> {
    try {
      const member = await SquadService.changeMemberRole(
        accountId,
        squadName,
        userId,
        role
      );
      const dto = new SquadMemberWithUserAndSquadDto(member);
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
