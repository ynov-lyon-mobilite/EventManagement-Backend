import { EventCategories } from '.prisma/client';
import { db } from '@api/clients/prisma-client';
import { builder } from '../builder';

export const EventCategoryObject = builder.objectRef<EventCategories>(
  'EventCategory'
);

builder.objectType(EventCategoryObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    name: t.exposeString('name'),
    isActive: t.boolean({
      resolve: (eventCategory) => eventCategory.deletedAt === null,
    }),
  }),
});

builder.queryField('eventCategories', (t) =>
  t.field({
    type: [EventCategoryObject],
    resolve: (_root, _args, { user }) => {
      if (user && user.roles.includes('ADMIN')) {
        return db.eventCategories.findMany();
      }
      return db.eventCategories.findMany({
        where: { deletedAt: { equals: null } },
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
      return db.eventCategories.create({
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
      return db.eventCategories.update({
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
    resolve: async (_, { uuid }, { dataSources }) => {
      return dataSources.eventCategory.deleteEventCategory(uuid);
    },
  })
);

builder.mutationField('deleteEventCategories', (t) =>
  t.field({
    type: [EventCategoryObject],
    authScopes: { isAdmin: true },
    args: {
      uuids: t.arg.stringList({ required: true }),
    },
    resolve: async (_, { uuids }, { dataSources }) => {
      const deletePromise = uuids.map(async (uuid) => {
        return dataSources.eventCategory.deleteEventCategory(uuid);
      });

      return Promise.all(deletePromise);
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
      return db.eventCategories.update({
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
