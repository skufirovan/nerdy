import axios from "axios";
import fs from "fs";
import path from "path";
import { UserService } from "../UserService";
import { SquadRepository } from "@infrastructure/repositories";
import { UserError } from "@infrastructure/error";
import { serviceLogger } from "@infrastructure/logger";
import { Squad, SquadMemberRole } from "@prisma/generated";
import {
  NON_UPDATABLE_SQUAD_FIELDS,
  SquadMemberWithUserAndSquad,
  SquadWithMembers,
} from "@domain/types";

export class SquadService {
  static async createSquad(
    accountId: bigint,
    name: string,
    photo: string,
    fileUrl: string
  ): Promise<Squad> {
    try {
      const user = await UserService.findByAccountId(accountId);

      if (!user) throw new UserError("Ты не зарегистрирован");
      if (!user.hasPass) throw new UserError("У тебя нет подписки NERD PASS");

      const existing = await SquadRepository.findMembershipByUserId(accountId);
      if (existing)
        throw new UserError(
          `Ты уже состоишь в объединении ${existing.squadName}`
        );

      if (fileUrl) {
        const response = await axios.get(fileUrl, { responseType: "stream" });
        const dir = path.resolve("public", "squads");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const filePath = path.resolve(dir, `${name}.jpg`);
        const writer = fs.createWriteStream(filePath);

        await new Promise<void>((resolve, reject) => {
          response.data.pipe(writer);
          writer.on("finish", () => resolve(undefined));
          writer.on("error", (err) => reject(err));
        });
      }

      const squad = await SquadRepository.createSquad(
        accountId,
        name,
        user.seasonalFame,
        photo
      );

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
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при создании объединения");
    }
  }

  static async addMember(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<SquadMemberWithUserAndSquad> {
    try {
      const squad = await SquadRepository.findSquadByName(squadName);
      const members = await SquadRepository.findSquadMembers(squadName);

      const user = await UserService.findByAccountId(userId);
      const existing = await SquadRepository.findMembershipByUserId(userId);

      if (!user) throw new UserError("Приглашаемый игрок не зарегистрирован");
      if (!squad) throw new UserError(`Объединение ${squadName} не найдено`);
      if (members.length > squad.capacity)
        throw new UserError(`В объединении ${squadName} нет места`);

      const requester = members.find((m) => m.accountId === accountId);
      if (!requester)
        throw new UserError(`Ты не состоишь в объединении ${squadName}`);
      if (
        requester.role !== SquadMemberRole.ADMIN &&
        requester.role !== SquadMemberRole.RECRUITER
      )
        throw new UserError("Ты не можешь приглашать артистов на лейбл");

      if (existing)
        throw new UserError(
          `Игрок уже состоит в объединении ${existing.squadName}`
        );

      const member = await SquadRepository.addMember(
        squadName,
        userId,
        user.seasonalFame
      );

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
      if (error instanceof UserError) throw error;
      throw new Error("Ошибка при добавлении участника в объединение");
    }
  }

  static async findSquadByAdminId(
    accountId: bigint,
    adminId: bigint
  ): Promise<Squad | null> {
    try {
      return await SquadRepository.findSquadByAdminId(adminId);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.findSquadByAdminId",
        `Ошибка при поиске объединения ${adminId}: ${err}`,
        { accountId }
      );
      throw new Error(`Ошибка при поиске объединения ${adminId}`);
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
      throw new Error(`Ошибка при поиске объединения ${name}`);
    }
  }

  static async findMembershipByUserId(
    accountId: bigint
  ): Promise<SquadMemberWithUserAndSquad | null> {
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
      throw new Error("Не удалось получить данные об участии в объединении");
    }
  }

  static async findSquadMembers(
    accountId: bigint,
    squadName: string
  ): Promise<SquadMemberWithUserAndSquad[]> {
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
      throw new Error("Ошибка при получении участников объединения");
    }
  }

  static async findTopSquads(
    accountId: bigint,
    limit: number = 10
  ): Promise<SquadWithMembers[]> {
    try {
      return await SquadRepository.findTopSquads(limit);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.findTopSquads",
        `Ошибка при получении рейтинга объединений: ${err}`,
        { accountId }
      );
      throw new Error("Ошибка при получении рейтинга объединений");
    }
  }

  static async deleteSquad(
    accountId: bigint,
    squadName: string
  ): Promise<Squad> {
    try {
      const user = await SquadRepository.findMembershipByUserId(accountId);
      const squad = await SquadRepository.findSquadByName(squadName);

      if (!squad) throw new UserError(`Объединение ${squadName} не найдено`);
      if (!user)
        throw new UserError(`Ты не состоишь в объединении ${squadName}`);
      if (user.role !== SquadMemberRole.ADMIN)
        throw new UserError("Только администратор может удалить объединение");

      const deletedSquad = await SquadRepository.deleteSquad(
        accountId,
        squadName
      );

      const filePath = path.resolve("public", "squads", `${squadName}.jpg`);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

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
      if (error instanceof UserError) throw error;
      throw new Error(`Ошибка при удалении объединения ${squadName}`);
    }
  }

  static async deleteSquadMember(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<SquadMemberWithUserAndSquad | Squad> {
    try {
      const isSelfLeave = accountId === userId;

      const requesterUser = await UserService.findByAccountId(accountId);
      const requesterMembership = await SquadRepository.findMembershipByUserId(
        accountId
      );

      const targetUser = await UserService.findByAccountId(userId);
      const targetMember = await SquadRepository.findMembershipByUserId(userId);

      if (!requesterUser) throw new UserError("Ты не зарегистрирован");
      if (!targetUser) throw new UserError(`Участник объединения не найден`);

      if (!requesterMembership || requesterMembership.squadName !== squadName)
        throw new UserError(`Ты не состоишь в объединении ${squadName}`);
      if (!targetMember || targetMember.squadName !== squadName)
        throw new UserError(
          `${targetUser.nickname} не состоит в объединении ${squadName}`
        );

      if (isSelfLeave) {
        if (requesterMembership.role !== SquadMemberRole.ADMIN) {
          const deletedMember = await SquadRepository.deleteSquadMember(
            squadName,
            accountId,
            requesterUser.seasonalFame
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

          const filePath = path.resolve("public", "squads", `${squadName}.jpg`);
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
          }

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
          throw new UserError("Не удалось передать права на объединение");
        }

        await SquadRepository.changeMemberRole(
          squadName,
          nextOwner.accountId,
          "ADMIN"
        );
        await SquadRepository.updateSquadInfo(squadName, {
          adminId: nextOwner.accountId,
        });

        const deletedMember = await SquadRepository.deleteSquadMember(
          squadName,
          accountId,
          requesterUser.seasonalFame
        );

        serviceLogger(
          "info",
          "SquadService.deleteSquadMember",
          `Админ передал права и покинул объединение: ${squadName}`,
          { accountId }
        );

        return deletedMember;
      }

      if (requesterMembership.role !== SquadMemberRole.ADMIN)
        throw new UserError("Ты не можешь исключить игрока из объединения");

      const deletedMember = await SquadRepository.deleteSquadMember(
        squadName,
        userId,
        targetUser.seasonalFame
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
        `Ошибка при удалении участника из объединения ${squadName}: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error(
        `Ошибка при удалении участника из объединения ${squadName}`
      );
    }
  }

  static async updateSquadInfo(
    accountId: bigint,
    squadName: string,
    data: Partial<Omit<Squad, NON_UPDATABLE_SQUAD_FIELDS>>
  ): Promise<Squad> {
    try {
      const updatedSquad = await SquadRepository.updateSquadInfo(
        squadName,
        data
      );

      serviceLogger(
        "info",
        "SquadService.updateSquadInfo",
        `Обновлены данные объединения ${JSON.stringify(data)}`
      );

      return updatedSquad;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.updateSquadInfo",
        `Ошибка при обновлении данных объединения ${squadName}: ${err}`,
        { accountId }
      );
      throw new Error(`Ошибка при обновлении данных объединения ${squadName}`);
    }
  }

  static async changeMemberRole(
    accountId: bigint,
    squadName: string,
    userId: bigint,
    role: SquadMemberRole
  ): Promise<SquadMemberWithUserAndSquad> {
    try {
      if (accountId === userId)
        throw new UserError("Нельзя изменить собственную роль");

      const requester = await SquadRepository.findMembershipByUserId(accountId);

      if (!requester)
        throw new UserError(`Ты не состоишь в объединении ${squadName}`);
      if (requester.role !== SquadMemberRole.ADMIN)
        throw new UserError("Только администратор может менять роли");

      const member = await SquadRepository.findMembershipByUserId(userId);

      if (!member || member.squadName !== squadName)
        throw new UserError(`Игрок не состоит в объединении ${squadName}`);

      return await SquadRepository.changeMemberRole(squadName, userId, role);
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.changeMemberRole",
        `Ошибка при изменении роли участника объединения ${squadName}: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error(
        `Ошибка при изменении роли участника объединения ${squadName}`
      );
    }
  }

  static async transferOwnership(
    accountId: bigint,
    squadName: string,
    userId: bigint
  ): Promise<Squad> {
    try {
      if (accountId === userId)
        throw new UserError("Нельзя передать права на объединение самому себе");

      const prevAdmin = await SquadRepository.findMembershipByUserId(accountId);

      if (!prevAdmin || prevAdmin.squadName !== squadName)
        throw new UserError(`Ты не состоишь в объединении ${squadName}`);
      if (prevAdmin.role !== SquadMemberRole.ADMIN)
        throw new UserError(`Ты не владелец объединения ${squadName}`);

      const nextAdmin = await SquadRepository.findMembershipByUserId(userId);
      if (!nextAdmin || nextAdmin.squadName !== squadName)
        throw new UserError(`Игрок не состоит в объединении ${squadName}`);

      await SquadRepository.changeMemberRole(squadName, accountId, "MEMBER");
      await SquadRepository.changeMemberRole(squadName, userId, "ADMIN");
      const squad = await SquadRepository.updateSquadInfo(squadName, {
        adminId: userId,
      });

      serviceLogger(
        "info",
        "SquadService.transferOwnership",
        `Админ передал права на объединение: ${squadName}`,
        { accountId }
      );

      return squad;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      serviceLogger(
        "error",
        "SquadService.transferOwnership",
        `Ошибка при передаче прав на объединение ${squadName}: ${err}`,
        { accountId }
      );
      if (error instanceof UserError) throw error;
      throw new Error(`Ошибка при передаче прав на объединение ${squadName}`);
    }
  }
}
