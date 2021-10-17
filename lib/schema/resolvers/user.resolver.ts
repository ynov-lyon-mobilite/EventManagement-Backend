import { builder } from '@lib/schema/builder';
import { prisma } from '@lib/prisma-client';
import { paginationArgs } from '../args/pagination.args';
import { Prisma, RoleEnum, User } from '@prisma/client';
import { uuidArg } from '../args/generic.args';
import { isOwnerOrAdmin } from '../validation/isOwnerOrAdmin';
import { emailArg, passwordArg, usernameArg } from '../args/user.args';
import { hash } from 'bcryptjs';

export const UserObject = builder.objectRef<User>('User');

builder.objectType(UserObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid', {}),
    displayName: t.exposeString('displayName'),
    email: t.exposeString('email', { nullable: true }),
    username: t.exposeString('username', { nullable: true }),
    roles: t.expose('roles', { type: [RoleEnum] }),
  }),
});

builder.queryField('users', (t) =>
  t.field({
    type: [UserObject],
    args: {
      ...paginationArgs(t),
      search: t.arg.string({ required: false }),
    },
    // authScopes: { isAdmin: true },
    resolve: (_root, args) => {
      const contains = args.search ?? '';
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

builder.mutationField('deleteUser', (t) =>
  t.field({
    type: UserObject,
    args: {
      uuid: uuidArg(t),
    },
    authScopes: (_, { uuid }, { user }) => {
      return isOwnerOrAdmin(uuid, user);
    },
    resolve: (_, { uuid }) => {
      return prisma.user.delete({ where: { uuid } });
    },
  })
);

builder.mutationField('updateUser', (t) =>
  t.field({
    type: UserObject,
    args: {
      displayName: t.arg.string({}),
      email: emailArg(t, false),
      password: passwordArg(t, false),
      username: usernameArg(t, false),
      uuid: uuidArg(t),
      roles: t.arg({ type: [RoleEnum], required: false }),
    },
    authScopes: (_, { uuid, roles }, { user }) => {
      if (roles && !user?.roles.includes('ADMIN')) return false;
      return isOwnerOrAdmin(uuid, user);
    },
    resolve: async (_, args) => {
      const hashPassword = args.password
        ? await hash(args.password, 4)
        : undefined;

      const datas: Prisma.UserUpdateArgs['data'] = {
        displayName: args.displayName,
        email: args.email,
        password: hashPassword,
        username: args.username,
      };

      if (args.roles) datas.roles = args.roles;

      return prisma.user.update({
        where: { uuid: args.uuid },
        data: {
          ...datas,
        },
      });
    },
  })
);
