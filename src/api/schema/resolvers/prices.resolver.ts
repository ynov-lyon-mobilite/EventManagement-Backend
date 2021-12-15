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
