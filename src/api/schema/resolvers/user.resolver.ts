import { builder } from 'src/api/schema/builder';
import { prisma } from 'src/api/prisma-client';
import { cursorArgs, generateCursorFindMany } from '../args/pagination.args';
import { Prisma, RoleEnum, User } from '@prisma/client';
import { uuidArg } from '../args/generic.args';
import { isOwnerOrAdmin } from '../validation/isOwnerOrAdmin';
import { emailArg, passwordArg } from '../args/user.args';
import { hash } from 'bcryptjs';
import { EventObject } from './event.resolver';
import { createConnection, createConnectionObject } from './edge.resolver';
import { BookingObject } from './booking.resolver';

export const UserObject = builder.objectRef<User>('User');
export const UserConnection = createConnection(UserObject);

builder.objectType(UserObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid', {}),
    displayName: t.exposeString('displayName'),
    email: t.exposeString('email'),
    roles: t.expose('roles', { type: [RoleEnum] }),
    joinedEvents: t.field({
      type: [EventObject],
      authScopes: ({ uuid }, _, { user }) => {
        return isOwnerOrAdmin(uuid, user);
      },
      resolve: async ({ uuid }) => {
        const bookings = await prisma.user
          .findUnique({ where: { uuid } })
          .bookings({
            select: { eventPrice: { select: { event: true } } },
          });
        return bookings.map((booking) => booking.eventPrice.event);
      },
    }),
    bookings: t.field({
      type: [BookingObject],
      authScopes: ({ uuid }, _, { user }) => {
        return isOwnerOrAdmin(uuid, user);
      },
      resolve: ({ uuid }) => {
        return prisma.user.findUnique({ where: { uuid } }).bookings();
      },
    }),
  }),
});

builder.queryField('users', (t) =>
  t.field({
    type: UserConnection,
    args: {
      ...cursorArgs(t),
    },
    authScopes: { isAdmin: true },
    resolve: (_root, args) => {
      const findArgs = generateCursorFindMany(args);
      return createConnectionObject({
        args,
        count: prisma.user.count(),
        edges: prisma.user.findMany({
          ...findArgs,
          orderBy: { createdAt: 'asc' },
        }),
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
      displayName: t.arg.string({ required: false }),
      email: emailArg(t, false),
      password: passwordArg(t, false),
      uuid: uuidArg(t),
      roles: t.arg({ type: [RoleEnum], required: false }),
    },
    authScopes: (_, { uuid, roles }, { user }) => {
      if (roles && !user?.roles.includes('ADMIN')) return false;
      return isOwnerOrAdmin(uuid, user);
    },
    resolve: async (_, args, { dataSources }) => {
      const hashPassword = args.password
        ? await hash(args.password, 4)
        : undefined;

      const datas: Prisma.UserUpdateArgs['data'] = {
        displayName: args.displayName ?? undefined,
        email: args.email,
        password: hashPassword,
      };
      if (args.roles) datas.roles = args.roles;

      return dataSources.user.updateUser(args.uuid, datas);
    },
  })
);
