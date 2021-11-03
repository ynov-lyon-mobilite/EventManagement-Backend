import { prisma } from '../src/api/prisma-client';
import { hash } from 'bcryptjs';

async function main() {
  console.info('🌱 Seeding database');

  const password = await hash('hophop', 4);

  await prisma.user.upsert({
    where: { username: 'pelcatmart' },
    update: {},
    create: {
      displayName: 'Martin PELCAT',
      username: `pelcatmart`,
      email: 'martin.pelcat@yvent.com',
      password,
      roles: {
        set: ['ADMIN', 'DEV'],
      },
    },
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      displayName: 'Admin YVENT',
      username: `admin`,
      email: 'admin@yvent.com',
      password,
      roles: {
        set: ['ADMIN', 'DEV'],
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
