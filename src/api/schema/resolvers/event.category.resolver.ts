import { EventCategories } from '.prisma/client';
import { prisma } from 'src/api/prisma-client';
import { builder } from '../builder';

export const EventCategoryObject = builder.objectRef<EventCategories>(
  'EventCategory'
);

builder.objectType(EventCategoryObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    name: t.exposeString('name'),
    isActive: t.boolean({
      resolve: (eventCategory) => eventCategory.deletedAt !== null,
    }),
  }),
});

builder.queryField('eventCategories', (t) =>
  t.field({
    type: [EventCategoryObject],
    resolve: (_root, _args, { user }) => {
      if (user && user.roles.includes('ADMIN')) {
        return prisma.eventCategories.findMany();
      }
      return prisma.eventCategories.findMany({
        where: { deletedAt: { not: null } },
      });
    },
  })
);

builder.mutationField('createEventCategory', (t) =>
  t.field({
    type: EventCategoryObject,
    authScopes: { isAdmin: true },
    args: {
      name: t.arg.string({ required: true }),
    },
    resolve: async (_, { name }) => {
      return prisma.eventCategories.create({
        data: {
          name,
        },
      });
    },
  })
);

builder.mutationField('updateEventCategory', (t) =>
  t.field({
    type: EventCategoryObject,
    authScopes: { isAdmin: true },
    args: {
      uuid: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
    },
    resolve: async (_, { uuid, name }) => {
      return prisma.eventCategories.update({
        where: {
          uuid,
        },
        data: {
          name,
        },
      });
    },
  })
);

builder.mutationField('deleteEventCategory', (t) =>
  t.field({
    type: EventCategoryObject,
    authScopes: { isAdmin: true },
    args: {
      uuid: t.arg.string({ required: true }),
    },
    resolve: async (_, { uuid }) => {
      return prisma.eventCategories.update({
        where: {
          uuid,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    },
  })
);

builder.mutationField('restoreEventCategory', (t) =>
  t.field({
    type: EventCategoryObject,
    authScopes: { isAdmin: true },
    args: {
      uuid: t.arg.string({ required: true }),
    },
    resolve: async (_, { uuid }) => {
      return prisma.eventCategories.update({
        where: {
          uuid,
        },
        data: {
          deletedAt: null,
        },
      });
    },
  })
);
