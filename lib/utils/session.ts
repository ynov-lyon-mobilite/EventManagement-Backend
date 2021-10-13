import { NextApiHandler } from 'next';
import { withIronSession } from 'next-iron-session';

export const withSession = (handler: NextApiHandler) =>
  withIronSession(handler, {
    password: process.env.SESSION_SECRET ?? '',
    cookieName: 'evenementiel.session',
  });
