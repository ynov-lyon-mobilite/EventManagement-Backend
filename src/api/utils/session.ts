import { IncomingNextMessage } from '@api/schema/types';
import session from 'express-session';

export const useSession = session({
  secret: process.env.SESSION_SECRET ?? '',
  name: 'yvent-api',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
});

export const destroySession = (req: IncomingNextMessage) => {
  return new Promise<void>((res, rej) => {
    req.session.destroy((err) => {
      if (err) rej(err);
      res();
    });
  });
};
