import { EventPrices } from '.prisma/client';
import { prisma } from '@api/prisma-client';
import { builder } from '../builder';

export const PriceObject = builder.objectRef<EventPrices>('Price');

builder.objectType(PriceObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    description: t.exposeString('description'),
    amount: t.exposeFloat('amount'),
  }),
});

builder.mutationField('createPrice', (t) =>
  t.field({
    type: PriceObject,
    authScopes: { isAdmin: true },
    args: {
      eventUuid: t.arg.string(),
      amount: t.arg.float(),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_, args, { dataSources }) => {
      const event = await prisma.event.findUnique({
        where: { uuid: args.eventUuid },
      });

      return dataSources.price.createPrice(event.uuid, {
        amount: args.amount,
        description: args.description ?? undefined,
      });
    },
  })
);

builder.mutationField('updatePrice', (t) =>
  t.field({
    type: PriceObject,
    authScopes: { isAdmin: true },
    args: {
      uuid: t.arg.string(),
      amount: t.arg.float(),
      description: t.arg.string({ required: false }),
    },
    resolve: async (_, args, { dataSources }) => {
      const price = await prisma.eventPrices.findUnique({
        where: { uuid: args.uuid },
      });

      return dataSources.price.updatePrice(price.uuid, {
        amount: args.amount,
        description: args.description ?? undefined,
      });
    },
  })
);

builder.mutationField('deletePrice', (t) =>
  t.field({
    type: PriceObject,
    authScopes: { isAdmin: true },
    args: {
      uuid: t.arg.string(),
    },
    resolve: async (_, args, { dataSources }) => {
      const price = await prisma.eventPrices.findUnique({
        where: { uuid: args.uuid },
      });

      return dataSources.price.deletePrice(price.uuid);
    },
  })
);
