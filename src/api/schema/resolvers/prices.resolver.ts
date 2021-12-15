import { EventPrices } from '.prisma/client';
import { builder } from '../builder';

export const PriceObject = builder.objectRef<EventPrices>('Price');

export const CreatePriceInput = builder
  .inputRef<Pick<EventPrices, 'amount' | 'description'>>('CreatePriceInput')
  .implement({
    fields: (t) => ({
      amount: t.float({ required: true }),
      description: t.string({ required: true }),
    }),
  });

builder.objectType(PriceObject, {
  fields: (t) => ({
    uuid: t.exposeString('uuid'),
    description: t.exposeString('description'),
    amount: t.exposeFloat('amount'),
  }),
});
