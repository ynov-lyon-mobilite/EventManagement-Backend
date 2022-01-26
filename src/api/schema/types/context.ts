import { CustomPubSub } from '@api/utils/pubsub.utils';
import { RoleEnum, User } from '@prisma/client';
import session from 'express-session';
import { IncomingMessage, ServerResponse } from 'http';
import { BookingService } from '../services/booking.service';
import { EventCategoryService } from '../services/event.category.service';
import { EventService } from '../services/event.service';
import { PriceService } from '../services/price.service';
import { UserService } from '../services/user.service';

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

export type CommonContext = {
  user: SessionUserPayload | undefined;
  dataSources: DataSources;
  pubsub: CustomPubSub;
};

export type HttpContext = CommonContext & {
  req: IncomingNextMessage;
  res: ServerResponse;
};

export type SubscriptionContext = CommonContext;

export type DataSources = typeof datasourcesServices;

export const datasourcesServices = {
  user: new UserService(),
  price: new PriceService(),
  event: new EventService(),
  booking: new BookingService(),
  eventCategory: new EventCategoryService(),
};

export type SessionUserPayload = User & { roles: RoleEnum[] };
