import { Event } from '.prisma/client';
import { prisma } from '@lib/prisma-client';
import { uuidArg } from '../args/generic.args';
import { builder } from '../builder';
import { UserObject } from './user.resolver';

export const EventObject = builder.objectRef<Event>('Event');

builder.objectType(EventObject, {
  fields: (t) => ({
    title: t.exposeString('title'),
    startDate: t.expose('startDate', { type: 'Date' }),
    endDate: t.expose('startDate', { type: 'Date' }),
    description: t.exposeString('description', { nullable: true }),
    price: t.exposeFloat('price', { nullable: true }),
    category: t.field({
      type: 'String',
      resolve: async ({ uuid }) => {
        const cat = await prisma.event
          .findUnique({ where: { uuid } })
          .category();
        return cat!.name;
      },
    }),
    participants: t.field({
      type: [UserObject],
      resolve: async ({ uuid }) => {
        const bookings = await prisma.event
          .findUnique({ where: { uuid } })
          .bookings({ select: { user: true } });

        return bookings.map((booking) => booking.user);
      },
    }),
  }),
});

builder.queryField('events', (t) =>
  t.field({
    type: [EventObject],
    resolve: () => {
      return prisma.event.findMany();
    },
  })
);

builder.queryField('event', (t) =>
  t.field({
    type: EventObject,
    args: {
      uuid: uuidArg(t),
    },
    resolve: (_root, { uuid }) => {
      return prisma.event.findUnique({ where: { uuid } });
    },
  })
);

builder.mutationField('createEvent', (t) =>
  t.field({
    authScopes: { isAdmin: true },
    type: EventObject,
    args: {
      title: t.arg.string(),
      categoriesUuid: uuidArg(t),
      startDate: t.arg({ type: 'Date' }),
      endDate: t.arg({ type: 'Date', required: false }),
      description: t.arg.string({ required: false }),
      price: t.arg.float({ required: false }),
    },
    resolve: (_, args) => {
      return prisma.event.create({
        data: {
          title: args.title,
          startDate: args.startDate,
          category: { connect: { uuid: args.categoriesUuid } },
          description: args.description,
          endDate: args.endDate,
          price: args.price ?? 0,
        },
      });
    },
  })
);
