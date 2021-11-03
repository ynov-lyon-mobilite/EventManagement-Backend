import { prisma } from 'src/api/prisma-client';
import { builder } from 'src/api/schema/builder';
import { compare, hash } from 'bcryptjs';
import { SuccessObject } from './sucess.resolver';
import { UserObject } from './user.resolver';
import { emailArg, passwordArg, usernameArg } from '../args/user.args';
import { destroySession } from '@api/utils/session';

builder.mutationField('login', (t) =>
  t.field({
    type: UserObject,
    args: {
      email: emailArg(t),
      password: passwordArg(t),
    },
    resolve: async (_, { email, password }, ctx) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error('Invalid credentials');
      if (user.password) {
        const isPassValid = await compare(password, user.password);
        if (!isPassValid) throw new Error('Invalid credentials');
      }
      ctx.req.session.user = user;
      ctx.user = user;
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
            set: 'DEV',
          },
        },
      });
      ctx.req.session.user = user;
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
    resolve: async (_root, _arg, ctx) => {
      await destroySession(ctx.req);
      return { success: true };
    },
  })
);
