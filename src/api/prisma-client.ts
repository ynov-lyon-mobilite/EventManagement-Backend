import { PrismaClient } from '@prisma/client';

type CustomNodeJsGlobal = typeof globalThis & {
  prisma: PrismaClient<{ rejectOnNotFound: true }>;
};
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient({ rejectOnNotFound: true });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export { prisma };
