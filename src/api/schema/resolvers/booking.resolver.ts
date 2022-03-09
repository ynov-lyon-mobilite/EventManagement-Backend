import { Booking } from '.prisma/client';
import { db } from '@api/clients/prisma-client';
import { builder } from '../builder';
import { EventObject } from './event.resolver';
import { UserObject } from './user.resolver';

export const BookingObject = builder.objectRef<Booking>('Booking');

builder.objectType(BookingObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    refunded: t.exposeBoolean('refunded'),
    refundedAt: t.expose('refundedAt', { type: 'Date', nullable: true }),
    price: t.field({
      type: 'Float',
      nullable: true,
      resolve: async (root) => {
        const eventPrice = await db.booking
          .findUnique({ where: { uuid: root.uuid } })
          .eventPrice();
        return eventPrice?.amount;
      },
    }),
    event: t.field({
      type: EventObject,
      resolve: async (root) => {
        const event = await db.booking
          .findUnique({ where: { uuid: root.uuid } })
          .eventPrice()
          .event();
        return event!;
      },
    }),
    user: t.field({
      type: UserObject,
      resolve: async (root) => {
        const user = await db.booking
          .findUnique({ where: { uuid: root.uuid } })
          .user();
        return user!;
      },
    }),
  }),
});

builder.mutationField('createBooking', (t) =>
  t.field({
    type: BookingObject,
    args: {
      eventPriceUuid: t.arg.string({ required: true }),
    },
    authScopes: { isLogged: true },
    resolve: async (_, args, { dataSources, user }) => {
      //TODO: add paymentIntend stripe
      return dataSources.booking.createBooking({
        eventPrice: { connect: { uuid: args.eventPriceUuid } },
        user: { connect: { uuid: user!.uuid } },
      });
    },
  })
);

builder.mutationField('refundBooking', (t) =>
  t.field({
    type: BookingObject,
    args: {
      bookingUuid: t.arg.string({ required: true }),
    },
    authScopes: { isAdmin: true },
    resolve: async (_, args) => {
      const booking = await db.booking.findUnique({
        where: { uuid: args.bookingUuid },
      });

      if (booking.refunded) {
        throw new Error('Booking already refunded');
      }

      return db.booking.update({
        where: { uuid: args.bookingUuid },
        data: {
          refunded: true,
          refundedAt: new Date(),
        },
      });
    },
  })
);
