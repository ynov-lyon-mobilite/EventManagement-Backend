import { User } from '.prisma/client';
import { prisma } from '@api/prisma-client';
import { JWT_SECRET } from '@api/utils/jwt';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { emailArg, passwordArg, usernameArg } from '../args/user.args';
import { builder } from '../builder';
import { UserObject } from './user.resolver';

const UserAuthObject = builder.objectRef<{ user: User } & { jwt: string }>(
  'UserAuth'
);

builder.objectType(UserAuthObject, {
  fields: (t) => ({
    user: t.expose('user', { type: UserObject }),
    jwt: t.exposeString('jwt'),
  }),
});

builder.mutationField('login', (t) =>
  t.field({
    type: UserAuthObject,
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
      //TODO
      const jwt = sign(user, JWT_SECRET);
      ctx.user = user;
      return { user, jwt };
    },
  })
);

builder.mutationField('register', (t) =>
  t.field({
    type: UserAuthObject,
    args: {
      displayName: usernameArg(t),
      password: passwordArg(t),
      email: emailArg(t),
    },
    resolve: async (_root, { password, email, displayName }, ctx) => {
      const user = await ctx.dataSources.user.createUser({
        password,
        email,
        displayName,
      });
      const jwt = sign(user, JWT_SECRET);
      ctx.user = user;
      return { user, jwt };
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

builder.mutationField('changePassword', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      oldPassword: passwordArg(t),
      newPassword: passwordArg(t),
    },
    authScopes: { isLogged: true },
    resolve: async (_root, { oldPassword, newPassword }, { user }) => {
      const usr = await prisma.user.findUnique({
        where: { uuid: user!.uuid },
      });

      if (usr.password) {
        const isPassValid = await compare(oldPassword, usr.password);
        if (!isPassValid) throw new Error('Invalid password');
      }

      const password = await hash(newPassword, 10);

      await prisma.user.update({
        where: { uuid: user!.uuid },
        data: { password },
      });

      return true;
    },
  })
);
