import { RoleEnum, User } from '@prisma/client';
import session from 'express-session';
import { IncomingMessage, ServerResponse } from 'http';

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}
type Session = session.Session & Partial<session.SessionData>;

export type IncomingNextMessage = IncomingMessage & { session: Session };

export type Context = {
  req: IncomingNextMessage;
  res: ServerResponse;
  user: SessionUserPayload | undefined;
  dataSources: DataSources;
};

export type DataSources = {};

export type SessionUserPayload = User & { roles: RoleEnum[] };
