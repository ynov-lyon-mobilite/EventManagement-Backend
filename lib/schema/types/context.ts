import { Role, RoleEnum, User } from '@prisma/client';
import { IncomingMessage, ServerResponse } from 'http';
import { Session } from 'next-iron-session';

export type IncomingNextMessage = IncomingMessage & { session: Session };

export type Context = {
  req: IncomingNextMessage;
  res: ServerResponse;
  user: SessionUserPayload | undefined;
  dataSources: DataSources;
};

export type DataSources = {};

export type SessionUserPayload = User & { roles: RoleEnum[] };

export type UserWithRoles = User & {
  roles: {
    role: Role;
  }[];
};
