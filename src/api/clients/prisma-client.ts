import { PrismaClient } from '@prisma/client';

type CustomNodeJsGlobal = typeof globalThis & {
  _prisma: PrismaClient<{ rejectOnNotFound: true }>;
};
declare const global: CustomNodeJsGlobal;

const db = global._prisma || new PrismaClient({ rejectOnNotFound: true });

if (process.env.NODE_ENV === 'development') global._prisma = db;

export { db };
