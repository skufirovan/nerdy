// Temporary type stubs for Prisma
declare module '@prisma/generated' {
  export interface User {
    id: bigint;
    telegramId: bigint;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    nickname?: string | null;
    level?: number;
    fame?: number;
    seasonalFame?: number;
    racks?: number;
    hasPass?: boolean;
    invitedUsersCount?: number;
    passExpiresAt?: Date | null;
    lastDemoRecordedAt?: Date | null;
    lastDemoDistributedAt?: Date | null;
    lastVideoRecordedAt?: Date | null;
    registeredAt?: Date;
    accountId?: bigint;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Demo {
    id: bigint;
    name: string;
    text?: string | null;
    fileId?: string | null;
    messageId?: string | null;
    userId: bigint;
    accountId?: bigint;
    recordedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
  }

  export interface Squad {
    id: bigint;
    name: string;
    description?: string | null;
    capacity?: number;
    adminId?: bigint | null;
    seasonalFame?: number;
    photo?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Equipment {
    id: bigint;
    name: string;
    type: EQUIPMENT_TYPE;
    description?: string | null;
    brand?: string;
    model?: string;
    price?: number;
    multiplier?: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Invoice {
    id: bigint;
    amount: number;
    description?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Video {
    id: bigint;
    title: string;
    url?: string | null;
    fileId?: string | null;
    description?: string | null;
    accountId?: bigint;
    demoId?: bigint;
    recordedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Gif {
    id: bigint;
    name: string;
    url?: string | null;
    fileId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface SquadMember {
    id: bigint;
    userId: bigint;
    squadId: bigint;
    role: SquadMemberRole;
    joinedAt: Date;
    squadName?: string;
    accountId?: bigint;
    user?: User;
    squad?: Squad;
  }

  export interface DistributedDemo {
    id: bigint;
    name: string;
    content?: string | null;
    demoId?: bigint;
    createdAt: Date;
    updatedAt: Date;
    likes?: DistributedDemoLike[];
    demo?: Demo;
  }

  export interface DistributedDemoLike {
    id: bigint;
    distributedDemoId: bigint;
    userId: bigint;
    accountId?: bigint;
    createdAt: Date;
    distributedDemo?: DistributedDemo;
  }

  export enum SquadMemberRole {
    OWNER = "OWNER",
    MEMBER = "MEMBER",
    ADMIN = "ADMIN",
    RECRUITER = "RECRUITER"
  }

  export enum EQUIPMENT_TYPE {
    WEAPON = "WEAPON",
    ARMOR = "ARMOR",
    ACCESSORY = "ACCESSORY",
    MICROPHONE = "MICROPHONE",
    HEADPHONES = "HEADPHONES"
  }

  export namespace Prisma {
    export interface UserGetPayload<T> {
      // Заглушка для Prisma типов
    }
    
    export interface PaymentGetPayload<T> {
      // Заглушка для Prisma типов
    }
    
    export interface UserEquipmentGetPayload<T> {
      // Заглушка для Prisma типов
    }
  }
}

declare module '@prisma/client' {
  export interface PrismaClient {
    $transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
    user: any;
    demo: any;
    squad: any;
    equipment: any;
    invoice: any;
    video: any;
    gif: any;
    squadMember: any;
    distributedDemo: any;
    distributedDemoLike: any;
  }

  export const prisma: PrismaClient;
}