import { EventPrices } from '.prisma/client';
import { builder } from '../builder';

export const PriceObject = builder.objectRef<EventPrices>('Price');

builder.objectType(PriceObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    description: t.exposeString('description'),
    price: t.exposeFloat('price'),
  }),
});
