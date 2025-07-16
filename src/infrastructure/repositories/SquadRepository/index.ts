import { prisma } from "@prisma/client";
import { SquadMemberWithUser } from "@domain/types";
import { Squad, SquadMemberRole } from "@prisma/generated";

export class SquadRepository {
  static async createSquad(adminId: bigint, name: string): Promise<Squad> {
    return prisma.$transaction(async (tx) => {
      const squad = await tx.squad.create({
        data: { adminId, name },
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
    role: SquadMemberRole = SquadMemberRole.MEMBER
  ): Promise<SquadMemberWithUser> {
    return prisma.squadMember.create({
      data: {
        squadName,
        accountId: newMemberId,
        role,
      },
      include: { user: true },
    });
  }

  static async findSquadByName(name: string): Promise<Squad | null> {
    return prisma.squad.findUnique({ where: { name } });
  }

  static async findMembershipByUserId(
    accountId: bigint
  ): Promise<SquadMemberWithUser | null> {
    return prisma.squadMember.findUnique({
      where: { accountId },
      include: { user: true },
    });
  }

  static async findSquadMembers(
    squadName: string
  ): Promise<SquadMemberWithUser[]> {
    return prisma.squadMember.findMany({
      where: { squadName },
      include: { user: true },
      orderBy: { user: { seasonalFame: "desc" } },
    });
  }

  static async deleteSquad(adminId: bigint, name: string): Promise<Squad> {
    return prisma.squad.delete({
      where: { adminId, name },
    });
  }

  static async deleteSquadMember(
    squadName: string,
    accountId: bigint
  ): Promise<SquadMemberWithUser> {
    return prisma.squadMember.delete({
      where: {
        squadName,
        accountId,
      },
      include: { user: true },
    });
  }

  static async changeMemberRole(
    squadName: string,
    accountId: bigint,
    role: SquadMemberRole
  ): Promise<SquadMemberWithUser> {
    return prisma.squadMember.update({
      where: {
        squadName,
        accountId,
      },
      data: { role },
      include: { user: true },
    });
  }

  static async transferOwnership(
    squadName: string,
    adminId: bigint
  ): Promise<Squad> {
    return prisma.squad.update({
      where: { name: squadName },
      data: { adminId },
    });
  }
}
