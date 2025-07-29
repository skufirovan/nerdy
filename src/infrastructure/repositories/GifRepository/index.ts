import { prisma } from "@prisma/client";
import { Gif } from "@prisma/generated";

export class GifRepository {
  static async findByName(name: string): Promise<Gif | null> {
    return prisma.gif.findUnique({ where: { name } });
  }

  static async updateFileId(name: string, fileId: string): Promise<Gif> {
    return prisma.gif.update({ where: { name }, data: { fileId } });
  }
}
