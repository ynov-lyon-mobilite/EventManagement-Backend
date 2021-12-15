import { prisma } from '../src/api/prisma-client';
import { hash } from 'bcryptjs';

async function main() {
  console.info('🌱 Seeding database');

  const password = await hash('hophop', 4);

  await prisma.user.upsert({
    where: { email: 'martin.pelcat@yvent.com' },
    update: {},
    create: {
      displayName: 'Martin PELCAT',
      email: 'martin.pelcat@yvent.com',
      password,
      roles: {
        set: [],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@yvent.com' },
    update: {},
    create: {
      displayName: 'Admin YVENT',
      email: 'admin@yvent.com',
      password,
      roles: {
        set: ['ADMIN'],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
