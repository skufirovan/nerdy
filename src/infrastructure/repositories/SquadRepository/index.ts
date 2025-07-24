import { prisma } from "@prisma/client";
import { Squad, SquadMemberRole } from "@prisma/generated";
import {
  NON_UPDATABLE_SQUAD_FIELDS,
  SquadMemberWithUserAndSquad,
  SquadWithMembers,
} from "@domain/types";

export class SquadRepository {
  static async createSquad(
    adminId: bigint,
    name: string,
    seasonalFame: number,
    photo: string
  ): Promise<Squad> {
    return prisma.$transaction(async (tx) => {
      const squad = await tx.squad.create({
        data: { adminId, name, seasonalFame, photo },
      });

      await tx.squadMember.create({
        data: {
          squadName: name,
          accountId: adminId,
          role: SquadMemberRole.ADMIN,
        },
      });

      return squad;
    });
  }

  static async addMember(
    squadName: string,
    newMemberId: bigint,
    seasonalFame: number,
    role: SquadMemberRole = SquadMemberRole.MEMBER
  ): Promise<SquadMemberWithUserAndSquad> {
    await prisma.squad.update({
      where: { name: squadName },
      data: { seasonalFame: { increment: seasonalFame } },
    });

    return prisma.squadMember.create({
      data: {
        squadName,
        accountId: newMemberId,
        role,
      },
      include: { user: true, squad: true },
    });
  }

  static async findSquadByAdminId(adminId: bigint): Promise<Squad | null> {
    return prisma.squad.findUnique({ where: { adminId } });
  }

  static async findSquadByName(name: string): Promise<Squad | null> {
    return prisma.squad.findUnique({ where: { name } });
  }

  static async findMembershipByUserId(
    accountId: bigint
  ): Promise<SquadMemberWithUserAndSquad | null> {
    return prisma.squadMember.findUnique({
      where: { accountId },
      include: { user: true, squad: true },
    });
  }

  static async findSquadMembers(
    squadName: string
  ): Promise<SquadMemberWithUserAndSquad[]> {
    return prisma.squadMember.findMany({
      where: { squadName },
      include: { user: true, squad: true },
      orderBy: { user: { seasonalFame: "desc" } },
    });
  }

  static async findTopSquads(limit: number = 10): Promise<SquadWithMembers[]> {
    return prisma.squad.findMany({
      orderBy: { seasonalFame: "desc" },
      take: limit,
      include: { members: { include: { user: true, squad: true } } },
    });
  }

  static async deleteSquad(adminId: bigint, name: string): Promise<Squad> {
    return prisma.squad.delete({
      where: { adminId, name },
    });
  }

  static async deleteSquadMember(
    squadName: string,
    accountId: bigint,
    seasonalFame: number
  ): Promise<SquadMemberWithUserAndSquad> {
    await prisma.squad.update({
      where: { name: squadName },
      data: { seasonalFame: { decrement: seasonalFame } },
    });

    return prisma.squadMember.delete({
      where: {
        squadName,
        accountId,
      },
      include: { user: true, squad: true },
    });
  }

  static async updateSquadInfo(
    squadName: string,
    data: Partial<Omit<Squad, NON_UPDATABLE_SQUAD_FIELDS>>
  ): Promise<Squad> {
    return prisma.squad.update({ where: { name: squadName }, data });
  }

  static async changeMemberRole(
    squadName: string,
    accountId: bigint,
    role: SquadMemberRole
  ): Promise<SquadMemberWithUserAndSquad> {
    return prisma.squadMember.update({
      where: {
        squadName,
        accountId,
      },
      data: { role },
      include: { user: true, squad: true },
    });
  }
}
