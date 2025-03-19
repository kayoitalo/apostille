import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class UserService {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async findAll() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}