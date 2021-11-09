import { RoleEnum, User } from '@prisma/client';
import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from '../services/user.service';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}
type Session = session.Session & Partial<session.SessionData>;

export type IncomingNextMessage = IncomingMessage & { session: Session } & {
  user: User;
};

export type JWTPayload = User;

export type Context = {
  req: IncomingNextMessage;
  res: ServerResponse;
  user: SessionUserPayload | undefined;
  dataSources: DataSources;
};

export type DataSources = typeof datasourcesServices;

export const datasourcesServices = {
  user: new UserService(),
};

export type SessionUserPayload = User & { roles: RoleEnum[] };
