import { Event, EventCategories, Prisma } from '.prisma/client';
import { prisma } from 'src/api/prisma-client';
import { uuidArg } from '../args/generic.args';
import { cursorArgs, generateCursorFindMany } from '../args/pagination.args';
import { builder } from '../builder';
import { createConnection, createConnectionObject } from './edge.resolver';
import { EventCategoryObject } from './event.category.resolver';
import { PriceObject } from './prices.resolver';
import { UserConnection } from './user.resolver';

export const EventObject = builder.objectRef<Event>('Event');
export const EventConnection = createConnection(EventObject);

builder.objectType(EventObject, {
  fields: (t) => ({
    title: t.exposeString('title'),
    startDate: t.expose('startDate', { type: 'Date' }),
    endDate: t.expose('startDate', { type: 'Date' }),
    description: t.exposeString('description', { nullable: true }),
    prices: t.field({
      type: [PriceObject],
      resolve: ({ uuid }) => {
        return prisma.event.findUnique({ where: { uuid } }).prices();
      },
    }),
    category: t.field({
      type: EventCategoryObject,
      resolve: async ({ uuid }) => {
        const category: EventCategories | null = await prisma.event
          .findUnique({ where: { uuid } })
          .category();
        return category!;
      },
    }),
    participants: t.field({
      type: UserConnection,
      args: {
        ...cursorArgs(t),
      },
      resolve: async ({ uuid }, args) => {
        const { cursor, skip, take } = generateCursorFindMany(args);

        const cursorArg:
          | Prisma.BookingWhereUniqueInput
          | undefined = cursor?.uuid
          ? {
              uuid: cursor.uuid,
            }
          : undefined;

        const bookings = await prisma.booking.findMany({
          where: { eventPrice: { event: { uuid } } },
          select: { user: true },
          take,
          skip,
          cursor: cursorArg,
        });

        return createConnectionObject({
          args,
          edges: bookings.map((booking) => booking.user),
          count: prisma.booking.count({
            where: { eventPrice: { event: { uuid } } },
          }),
        });
      },
    }),
    participantsCount: t.field({
      type: 'Int',
      resolve: async ({ uuid }) => {
        return prisma.booking.count({
          where: { eventPrice: { event: { uuid } } },
        });
      },
    }),
  }),
});

builder.queryField('events', (t) =>
  t.field({
    type: EventConnection,
    args: {
      ...cursorArgs(t),
    },
    resolve: (_, args) => {
      const findArgs = generateCursorFindMany(args);

      const where = { startDate: { gt: new Date() } };

      return createConnectionObject({
        args,
        count: prisma.event.count({ where }),
        edges: prisma.event.findMany({
          ...findArgs,
          where,
          orderBy: { startDate: 'asc' },
        }),
      });
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
      description: t.arg.string({ required: false }),
      categoriesUuid: uuidArg(t),
      startDate: t.arg({ type: 'Date' }),
      endDate: t.arg({ type: 'Date', required: false }),
      price: t.arg.float({ required: false }),
    },
    resolve: async (_, args, { dataSources }) => {
      const event = await dataSources.event.createEvent({
        title: args.title,
        description: args.description,
        startDate: args.startDate,
        category: { connect: { uuid: args.categoriesUuid } },
        endDate: args.endDate,
      });

      await dataSources.price.createPrice(event.uuid, {
        price: args.price ?? 0,
      });

      return event;
    },
  })
);

builder.mutationField('updateEvent', (t) =>
  t.field({
    type: EventObject,
    authScopes: { isAdmin: true },
    args: {
      uuid: uuidArg(t),
      title: t.arg.string({ required: false }),
      description: t.arg.string({ required: false }),
      categoriesUuid: uuidArg(t, false),
      startDate: t.arg({ type: 'Date', required: false }),
      endDate: t.arg({ type: 'Date', required: false }),
    },
    validate: ({ uuid, ...rest }) => {
      return Object.values(rest).some(
        (value) => value !== null || value !== undefined
      );
    },
    resolve: async (_root, args, { dataSources }) => {
      const datas: Prisma.EventUpdateArgs['data'] = {
        title: args.title ?? undefined,
        description: args.description ?? undefined,
        startDate: args.startDate ?? undefined,
        endDate: args.endDate ?? undefined,
      };

      if (args.categoriesUuid) {
        datas.category = { connect: { uuid: args.categoriesUuid } };
      }

      return dataSources.event.updateEvent(args.uuid, datas);
    },
  })
);

builder.mutationField('deleteEvent', (t) =>
  t.field({
    type: EventObject,
    args: {
      uuid: uuidArg(t),
    },
    authScopes: { isAdmin: true },
    resolve: (_root, { uuid }, { dataSources }) => {
      return dataSources.event.deleteEvent(uuid);
    },
  })
);

builder.mutationField('joinEvent', (t) =>
  t.field({
    deprecationReason: 'Not implemented yet',
    description: 'Pay to join the event',
    type: EventObject,
    authScopes: { isLogged: true },
    args: {
      uuid: uuidArg(t),
    },
    resolve: () => {
      throw new Error('Not implemented yet');
    },
  })
);

builder.queryField('eventParticipants', (t) =>
  t.field({
    type: UserConnection,
    args: {
      eventUuid: t.arg.string(),
      ...cursorArgs(t),
    },
    resolve: (_, args) => {
      const findArgs = generateCursorFindMany(args);

      return createConnectionObject({
        args,
        count: prisma.booking.count({
          where: { eventPrice: { event: { uuid: args.eventUuid } } },
        }),
        edges: prisma.user.findMany({
          ...findArgs,
          where: {
            bookings: {
              some: { eventPrice: { event: { uuid: args.eventUuid } } },
            },
          }, // Not sure about that
        }),
      });
    },
  })
);
