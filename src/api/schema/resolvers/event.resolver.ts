import { Event, EventCategories, Prisma } from '.prisma/client';
import { prisma } from 'src/api/prisma-client';
import { uuidArg } from '../args/generic.args';
import { cursorArgs, generateCursorFindMany } from '../args/pagination.args';
import { builder } from '../builder';
import { createConnection, createConnectionObject } from './edge.resolver';
import { EventCategoryObject } from './event.category.resolver';
import { UserConnection } from './user.resolver';

export const EventObject = builder.objectRef<Event>('Event');
export const EventConnection = createConnection(EventObject);

builder.objectType(EventObject, {
  fields: (t) => ({
    title: t.exposeString('title'),
    startDate: t.expose('startDate', { type: 'Date' }),
    endDate: t.expose('startDate', { type: 'Date' }),
    description: t.exposeString('description', { nullable: true }),
    price: t.float({
      resolve: ({ price }) => {
        return price ?? 0;
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
              eventUuid_userUuid: {
                userUuid: cursor.uuid,
                eventUuid: uuid,
              },
            }
          : undefined;

        const bookings = await prisma.event
          .findUnique({ where: { uuid } })
          .bookings({
            select: { user: true },
            take,
            skip,
            cursor: cursorArg,
          });

        return createConnectionObject({
          args,
          edges: bookings.map((booking) => booking.user),
          count: prisma.booking.count({
            where: { event: { uuid } },
          }),
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
    resolve: async (_, args) => {
      return prisma.event.create({
        data: {
          title: args.title,
          description: args.description,
          startDate: args.startDate,
          category: { connect: { uuid: args.categoriesUuid } },
          endDate: args.endDate,
          price: args.price ?? undefined,
        },
      });
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
      price: t.arg.float({ required: false }),
      categoriesUuid: uuidArg(t, false),
      startDate: t.arg({ type: 'Date', required: false }),
      endDate: t.arg({ type: 'Date', required: false }),
    },
    validate: ({ uuid, ...rest }) => {
      return Object.values(rest).some(
        (value) => value !== null || value !== undefined
      );
    },
    resolve: async (_root, args) => {
      const datas: Prisma.EventUpdateArgs['data'] = {
        title: args.title ?? undefined,
        description: args.description ?? undefined,
        startDate: args.startDate ?? undefined,
        endDate: args.endDate ?? undefined,
        price: args.price ?? undefined,
      };

      if (args.categoriesUuid) {
        datas.category = { connect: { uuid: args.categoriesUuid } };
      }

      //TODO: Notify user who already booked of the changes

      return prisma.event.update({
        where: { uuid: args.uuid },
        data: datas,
      });
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
    resolve: (_root, { uuid }) => {
      // TODO: Notify users
      // TODO: Refund converned users
      return prisma.event.delete({ where: { uuid } });
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
          where: { event: { uuid: args.eventUuid } },
        }),
        edges: prisma.user.findMany({
          ...findArgs,
          where: { bookings: { some: { event: { uuid: args.eventUuid } } } }, // Not sure about that
        }),
      });
    },
  })
);
