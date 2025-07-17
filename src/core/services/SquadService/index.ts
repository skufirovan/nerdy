import { UserService } from "../UserService";
import { SquadRepository } from "@infrastructure/repositories";
import serviceLogger from "@infrastructure/logger/serviceLogger";
import { Squad, SquadMemberRole } from "@prisma/generated";
import { SquadMemberWithUser } from "@domain/types";

export class SquadService {
  static async createSquad(accountId: bigint, name: string): Promise<Squad> {
    try {
      const user = await UserService.findByAccountId(accountId);

      if (!user) throw new Error(`Пользователь ${accountId} не найден`);
      if (!user.hasPass) throw new Error("Отсутствует NERD PASS");

      const existing = await SquadRepository.findMembershipByUserId(accountId);
      if (existing)
        throw new Error(
          `${accountId} уже состоит в объединении ${existing.squadName}`
        );

      const squad = await SquadRepository.createSquad(accountId, name);

      serviceLogger(
        "info",
        "SquadService.createSquad",
        `Создано объединение: ${name}`,
        { accountId }
      );

      return squad;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.createSquad",
        `Ошибка при создании объединения: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }

  static async addMember(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<SquadMemberWithUser> {
    try {
      const squad = await SquadRepository.findSquadByName(squadName);
      const members = await SquadRepository.findSquadMembers(squadName);
      const existing = await SquadRepository.findMembershipByUserId(userId);

      if (!squad) throw new Error(`Объединение ${squadName} не найдено`);
      if (members.length > squad.capacity)
        throw new Error(`В объединении ${squadName} нет места`);

      const requester = members.find((m) => m.accountId === accountId);
      if (!requester)
        throw new Error(`${accountId} не состоит в объединении ${squadName}`);
      if (
        requester.role !== SquadMemberRole.ADMIN &&
        requester.role !== SquadMemberRole.RECRUITER
      )
        throw new Error("Недостаточно прав");

      if (existing)
        throw new Error(
          `${userId} уже состоит в объединении ${existing.squadName}`
        );

      const member = await SquadRepository.addMember(squadName, userId);

      serviceLogger(
        "info",
        "SquadService.addMember",
        `Новый подписант в объединении: ${squadName}`,
        { accountId }
      );

      return member;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.addMember",
        `Ошибка при добавлении участника в объединение ${squadName}: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }

  static async findSquadByName(
    accountId: bigint,
    name: string
  ): Promise<Squad | null> {
    try {
      return await SquadRepository.findSquadByName(name);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.findSquadByName",
        `Ошибка при поиске объединения ${name}: ${err}`,
        { accountId }
      );
      throw new Error(`Сервис временно недоступен. Попробуйте позже.`);
    }
  }

  static async findMembershipByUserId(
    accountId: bigint
  ): Promise<SquadMemberWithUser | null> {
    try {
      return await SquadRepository.findMembershipByUserId(accountId);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.findMembershipByUserId",
        `Не удалось получить данные об участии в объединении: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }

  static async findSquadMembers(
    accountId: bigint,
    squadName: string
  ): Promise<SquadMemberWithUser[]> {
    try {
      return await SquadRepository.findSquadMembers(squadName);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.findSquadMembers",
        `Ошибка при получении участников объединения ${squadName}: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }

  static async deleteSquad(
    accountId: bigint,
    squadName: string
  ): Promise<Squad> {
    try {
      const user = await SquadRepository.findMembershipByUserId(accountId);
      const squad = await SquadRepository.findSquadByName(squadName);

      if (!squad) throw new Error(`Объединение ${squadName} не найдено`);
      if (!user)
        throw new Error(`${accountId} не состоит в объединении ${squadName}`);
      if (user.role !== SquadMemberRole.ADMIN)
        throw new Error("Только администратор может удалить объединение");

      const deletedSquad = await SquadRepository.deleteSquad(
        accountId,
        squadName
      );

      serviceLogger(
        "info",
        "SquadService.deleteSquad",
        `Удалено объединение: ${squadName}`,
        { accountId }
      );

      return deletedSquad;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.deleteSquad",
        `Ошибка при удалении объединения ${squadName}: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }

  static async deleteSquadMember(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<SquadMemberWithUser | Squad> {
    try {
      const isSelfLeave = accountId === userId;

      const requester = await SquadRepository.findMembershipByUserId(accountId);
      const targetMember = await SquadRepository.findMembershipByUserId(userId);

      if (!requester || requester.squadName !== squadName)
        throw new Error(`${accountId} не состоит в объединении ${squadName}`);
      if (!targetMember || requester.squadName !== squadName)
        throw new Error(`${userId} не состоит в объединении ${squadName}`);

      if (isSelfLeave) {
        if (requester.role !== SquadMemberRole.ADMIN) {
          const deletedMember = await SquadRepository.deleteSquadMember(
            squadName,
            userId
          );

          serviceLogger(
            "info",
            "SquadService.deleteSquadMember",
            `Участник покинул объединение: ${squadName}`,
            { accountId }
          );

          return deletedMember;
        }

        const members = await SquadRepository.findSquadMembers(squadName);

        if (members.length <= 1) {
          const deletedSquad = await SquadRepository.deleteSquad(
            accountId,
            squadName
          );

          serviceLogger(
            "info",
            "SquadService.deleteSquad",
            `Удалено объединение: ${squadName}`,
            { accountId }
          );

          return deletedSquad;
        }

        const nextOwner =
          members.find(
            (m) =>
              m.role === SquadMemberRole.RECRUITER && m.accountId !== accountId
          ) ?? members.find((m) => m.accountId !== accountId);

        if (!nextOwner) {
          throw new Error("Не удалось передать права на объединение");
        }

        await SquadRepository.changeMemberRole(
          squadName,
          nextOwner.accountId,
          "ADMIN"
        );
        await SquadRepository.transferOwnership(squadName, nextOwner.accountId);

        const deletedMember = await SquadRepository.deleteSquadMember(
          squadName,
          userId
        );

        serviceLogger(
          "info",
          "SquadService.deleteSquadMember",
          `Админ передал права и покинул объединение: ${squadName}`,
          { accountId }
        );

        return deletedMember;
      }

      if (requester.role !== SquadMemberRole.ADMIN)
        throw new Error(
          "Только администратор может удалять участников из объединения"
        );
      if (
        targetMember.role === SquadMemberRole.ADMIN ||
        targetMember.role === SquadMemberRole.RECRUITER
      )
        throw new Error(
          "Администратора или рекрутера нельзя удалить из объединения"
        );

      const deletedMember = await SquadRepository.deleteSquadMember(
        squadName,
        userId
      );

      serviceLogger(
        "info",
        "SquadService.deleteSquadMember",
        `Удален участник объединения: ${squadName}`,
        { accountId }
      );

      return deletedMember;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.deleteSquadMember",
        `Ошибка при удалении участника из объединения: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }

  static async changeMemberRole(
    accountId: bigint,
    squadName: string,
    userId: bigint,
    role: SquadMemberRole
  ): Promise<SquadMemberWithUser> {
    try {
      if (accountId === userId)
        throw new Error("Нельзя изменить собственную роль");

      const requester = await SquadRepository.findMembershipByUserId(accountId);

      if (!requester)
        throw new Error(`${accountId} не состоите в объединении ${squadName}`);
      if (requester.role !== SquadMemberRole.ADMIN)
        throw new Error("Только администратор может менять роли");

      const member = await SquadRepository.findMembershipByUserId(userId);

      if (!member || member.squadName !== squadName)
        throw new Error(`${userId} не состоит в объединении ${squadName}`);

      return await SquadRepository.changeMemberRole(squadName, userId, role);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.changeMemberRole",
        `Ошибка при изменении роли участника сквада: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }

  static async transferOwnership(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<Squad> {
    try {
      if (accountId === userId)
        throw new Error("Нельзя передать права на объединение самому себе");

      const prevAdmin = await SquadRepository.findMembershipByUserId(accountId);

      if (!prevAdmin || prevAdmin.squadName !== squadName)
        throw new Error(`${accountId} не состоит в объединении ${squadName}`);
      if (prevAdmin.role !== SquadMemberRole.ADMIN)
        throw new Error(
          `${accountId} не является владельцем объединения ${squadName}`
        );

      const nextAdmin = await SquadRepository.findMembershipByUserId(userId);
      if (!nextAdmin || nextAdmin.squadName !== squadName)
        throw new Error(`${userId} не состоит в объединении ${squadName}`);

      await SquadRepository.changeMemberRole(squadName, accountId, "MEMBER");
      await SquadRepository.changeMemberRole(squadName, userId, "ADMIN");
      const squad = await SquadRepository.transferOwnership(squadName, userId);

      serviceLogger(
        "info",
        "SquadService.deleteSquadMember",
        `Админ передал права на объединение: ${squadName}`,
        { accountId }
      );

      return squad;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.transferOwnership",
        `Ошибка при передаче прав на объединение: ${err}`,
        { accountId }
      );
      throw new Error("Сервис временно недоступен. Попробуйте позже.");
    }
  }
}
