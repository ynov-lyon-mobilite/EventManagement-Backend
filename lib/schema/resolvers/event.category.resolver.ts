import { EventCategories } from '.prisma/client';
import { prisma } from '@lib/prisma-client';
import { builder } from '../builder';

export const EventCategoryObject = builder.objectRef<EventCategories>(
  'EventCategory'
);

builder.objectType(EventCategoryObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    name: t.exposeString('name'),
  }),
});

builder.queryField('eventCategories', (t) =>
  t.field({
    type: [EventCategoryObject],
    resolve: () => {
      return prisma.eventCategories.findMany();
    },
  })
);
