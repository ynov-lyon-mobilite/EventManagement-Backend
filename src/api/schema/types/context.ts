import { RoleEnum, User } from '@prisma/client';
import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from '../services/user.service';
import session from 'express-session';
import { PriceService } from '../services/price.service';
import { EventService } from '../services/event.service';
import { BookingService } from '../services/booking.service';
import { EventCategoryService } from '../services/event.category.service';
import { PubSub } from 'graphql-subscriptions';

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
  pubsub: PubSub;
};

export type DataSources = typeof datasourcesServices;

export const datasourcesServices = {
  user: new UserService(),
  price: new PriceService(),
  event: new EventService(),
  booking: new BookingService(),
  eventCategory: new EventCategoryService(),
};

export type SessionUserPayload = User & { roles: RoleEnum[] };
