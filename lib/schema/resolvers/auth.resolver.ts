import { prisma } from '@lib/prisma-client';
import { builder } from '@lib/schema/builder';
import { compare, hash } from 'bcryptjs';
import { RoleEnum } from '@prisma/client';
import { SuccessObject } from './sucess.resolver';
import { UserObject } from './user.resolver';
import { SessionUserPayload, UserWithRoles } from '../types';
import { emailArg, passwordArg, usernameArg } from '../args/user.args';

const getSessionUserPayload = (user: UserWithRoles): SessionUserPayload => {
  const roles: RoleEnum[] = user.roles.map((perms) => {
    return perms.role.role_name;
  });

  return { ...user, roles };
};

builder.mutationField('login', (t) =>
  t.field({
    type: UserObject,
    args: {
      username: usernameArg(t),
      password: passwordArg(t),
    },
    resolve: async (_, { username, password }, ctx) => {
      const user = await prisma.user.findUnique({
        where: { username },
        include: { roles: { select: { role: true } } },
      });

      if (!user) throw new Error('Invalid credentials');
      if (user.password) {
        const isPassValid = await compare(password, user.password);
        if (!isPassValid) throw new Error('Invalid credentials');
      }
      ctx.req.session.set<SessionUserPayload>(
        'user',
        getSessionUserPayload(user)
      );
      await ctx.req.session.save();
      return user;
    },
  })
);

builder.mutationField('register', (t) =>
  t.field({
    type: UserObject,
    args: {
      username: usernameArg(t),
      password: passwordArg(t),
      email: emailArg(t),
    },
    resolve: async (_root, { password, email, username }, ctx) => {
      const hashPassword = await hash(password, 4);
      const user = await prisma.user.create({
        data: {
          displayName: username,
          username,
          password: hashPassword,
          email,
          roles: {
            create: {
              role: {
                connectOrCreate: {
                  create: { role_name: 'DEV' },
                  where: { role_name: 'DEV' },
                },
              },
            },
          },
        },
        include: { roles: { select: { role: true } } },
      });
      ctx.req.session.set<SessionUserPayload>(
        'user',
        getSessionUserPayload(user)
      );
      await ctx.req.session.save();
      return user;
    },
  })
);

builder.queryField('user_infos', (t) =>
  t.field({
    description: 'Get connected user informations',
    type: UserObject,
    authScopes: {
      isLogged: true,
    },
    resolve: (_root, _args, { user }) => {
      return prisma.user.findUnique({
        where: { uuid: user!.uuid },
      });
    },
  })
);

builder.mutationField('logout', (t) =>
  t.field({
    type: SuccessObject,
    authScopes: { isLogged: true },
    resolve: (_root, _arg, ctx) => {
      ctx.req.session.destroy();
      return { success: true };
    },
  })
);
