import { Event, EventCategories, Prisma, User } from '.prisma/client';
import { prisma } from '@api/prisma-client';
import { uuidArg } from '../args/generic.args';
import { cursorArgs, generateCursorFindMany } from '../args/pagination.args';
import { builder } from '../builder';
import { createConnection, createConnectionObject } from './edge.resolver';
import { EventCategoryObject } from './event.category.resolver';
import { PriceObject } from './prices.resolver';
import { UserConnection, UserObject } from './user.resolver';

export const EventObject = builder.objectRef<Event>('Event');
export const EventConnection = createConnection(EventObject);

builder.objectType(EventObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    title: t.exposeString('title'),
    startDate: t.expose('startDate', { type: 'Date' }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
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
      categoryUuid: uuidArg(t),
      startDate: t.arg({ type: 'Date' }),
      endDate: t.arg({ type: 'Date', required: false }),
    },
    resolve: async (_, args, { dataSources, pubsub }) => {
      const eventCategory = await prisma.eventCategories.findUnique({
        where: { uuid: args.categoryUuid },
      });
      if (eventCategory.deletedAt !== null) {
        throw new Error(
          'Il faut activer la categorie avant de pouvoir ajouter cet évenement'
        );
      }

      const event = await dataSources.event.createEvent({
        title: args.title,
        description: args.description,
        startDate: args.startDate,
        category: { connect: { uuid: args.categoryUuid } },
        endDate: args.endDate,
      });

      await dataSources.price.createPrice(event.uuid, {
        amount: 0,
      });

      pubsub.publish('newEvent', { ...event });

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
      categoryUuid: uuidArg(t, false),
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

      if (args.categoryUuid) {
        datas.category = { connect: { uuid: args.categoryUuid } };
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
    description: 'Pay to join the event',
    type: 'String',
    authScopes: { isLogged: true },
    args: {
      eventUuid: uuidArg(t),
      priceUuid: uuidArg(t),
      successUrl: t.arg.string({
        description: 'Url to redirect to on success',
      }),
      cancelUrl: t.arg.string({
        description: 'Url to redirect to on cancel',
      }),
    },
    resolve: (_, args, { user, dataSources }) => {
      return dataSources.event.joinEvent(
        user!,
        args.eventUuid,
        args.priceUuid,
        args.successUrl,
        args.cancelUrl
      );
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

builder.mutationField('createPrice', (t) =>
  t.field({
    type: PriceObject,
    args: {
      eventUuid: t.arg.string(),
      amount: t.arg.float(),
      description: t.arg.string({ required: false }),
    },
    resolve: (_, { eventUuid, amount, description }, { dataSources }) => {
      return dataSources.price.createPrice(eventUuid, {
        amount,
        description: description ?? undefined,
      });
    },
  })
);

builder.subscriptionField('eventCreated', (t) =>
  t.field({
    type: UserObject,
    subscribe: (_, _arg, { pubsub }) =>
      (pubsub.asyncIterator('eventCreated') as unknown) as AsyncIterable<User>,
    resolve: (payload: User) => {
      return payload;
    },
  })
);

builder.mutationField('testSub', (t) =>
  t.field({
    type: 'Boolean',
    resolve: async (_, _args, { pubsub }) => {
      const user = await prisma.user.findFirst({});
      pubsub.publish('eventCreated', user);
      return true;
    },
  })
);

builder.subscriptionField('newEvent', (t) =>
  t.field({
    type: EventObject,
    resolve: (root: Event) => root,
    subscribe: (_, _args, { pubsub }) => {
      return pubsub.asyncIterator('newEvent');
    },
  })
);
