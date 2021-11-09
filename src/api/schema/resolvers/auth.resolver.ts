import { prisma } from 'src/api/prisma-client';
import { builder } from 'src/api/schema/builder';
import { compare } from 'bcryptjs';
import { UserObject } from './user.resolver';
import { emailArg, passwordArg, usernameArg } from '../args/user.args';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@api/utils/jwt';
import { User } from '.prisma/client';

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
      ctx.req.session.user = user;
      ctx.user = user;
      return { user, jwt };
    },
  })
);

builder.mutationField('register', (t) =>
  t.field({
    type: UserAuthObject,
    args: {
      username: usernameArg(t),
      password: passwordArg(t),
      email: emailArg(t),
    },
    resolve: async (_root, { password, email, username }, ctx) => {
      const user = await ctx.dataSources.user.createUser({
        password,
        email,
        displayName: username,
        roles: {
          set: 'DEV',
        },
      });
      const jwt = sign(user, JWT_SECRET);
      ctx.user = user;
      ctx.req.session.user = user;

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
