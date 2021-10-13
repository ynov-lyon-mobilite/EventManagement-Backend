import { builder } from '@lib/schema/builder';
import { prisma } from '@lib/prisma-client';
import { paginationArgs } from '../args/pagination-args';
import { RoleEnum, User } from '@prisma/client';

export const UserObject = builder.objectRef<User>('User');

builder.objectType(UserObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid', {}),
    displayName: t.exposeString('displayName'),
    email: t.exposeString('email', { nullable: true }),
    username: t.exposeString('username', { nullable: true }),
    roles: t.field({
      type: [RoleEnum],
      resolve: async ({ uuid }) => {
        const user = await prisma.user.findUnique({
          where: { uuid },
          include: { roles: { select: { role: true } } },
        });
        return user.roles.map(({ role }) => role.role_name);
      },
    }),
  }),
});

builder.queryField('users', (t) =>
  t.field({
    type: [UserObject],
    args: {
      ...paginationArgs(t),
      search: t.arg.string({ required: false }),
    },
    resolve: (_root, args) => {
      const contains = args.search ?? undefined;
      return prisma.user.findMany({
        take: args.limit ?? undefined,
        skip: args.offset ?? undefined,
        where: {
          OR: [{ displayName: { contains } }, { username: { contains } }],
        },
      });
    },
  })
);

builder.queryField('user', (t) =>
  t.field({
    type: UserObject,
    nullable: true,
    args: {
      id: t.arg.string(),
    },
    resolve: (_root, args) => {
      return prisma.user.findUnique({ where: { uuid: args.id } });
    },
  })
);
