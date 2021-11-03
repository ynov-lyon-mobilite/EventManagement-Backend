import { RoleEnum, User } from '@prisma/client';
import { IncomingMessage, ServerResponse } from 'http';

export type IncomingNextMessage = IncomingMessage;

export type JWTPayload = User;

export type Context = {
  req: IncomingNextMessage;
  res: ServerResponse;
  user: SessionUserPayload | undefined;
  dataSources: DataSources;
};

export type DataSources = {};

export type SessionUserPayload = User & { roles: RoleEnum[] };
