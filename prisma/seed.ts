import { prisma } from '../lib/prisma-client';
import { hash } from 'bcryptjs';

async function main() {
  console.info('🌱 Seeding database');

  await prisma.role.createMany({
    data: [{ role_name: 'ADMIN' }, { role_name: 'DEV' }],
  });

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
        create: {
          role: {
            connectOrCreate: {
              create: { role_name: 'ADMIN' },
              where: { role_name: 'ADMIN' },
            },
          },
        },
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
