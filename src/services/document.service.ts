import { prisma } from '@/lib/prisma';
import { DocumentCreate, DocumentUpdate } from '../types/document';

export class DocumentService {
  async create(data: DocumentCreate) {
    return prisma.document.create({
      data,
    });
  }

  async findAll(userId: string) {
    return prisma.document.findMany({
      where: {
        userId,
      },
      include: {
        comments: true,
      },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.document.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        comments: true,
      },
    });
  }

  async update(id: string, userId: string, data: DocumentUpdate) {
    return prisma.document.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.document.delete({
      where: {
        id,
        userId,
      },
    });
  }
}